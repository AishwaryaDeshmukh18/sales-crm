import { useState, useEffect } from 'react';

// ==================== HELPER FUNCTIONS ====================

/**
 * Determine SLA status based on due date and task status
 */
const determineSlaStatus = (dueDate, status) => {
    const now = new Date();
    const due = new Date(dueDate);
    const hoursDiff = (due - now) / (1000 * 60 * 60);
    
    if (status !== 'Open' && status !== 'In Progress') return 'Active';
    if (due < now) return 'Breached';
    if (hoursDiff <= 24) return 'Due Soon';
    return 'Active';
};

/**
 * Format exception type with time remaining/overdue
 */
const formatExceptionType = (taskType, dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const hoursDiff = Math.round((due - now) / (1000 * 60 * 60));
    const daysDiff = Math.round(hoursDiff / 24);
    
    if (hoursDiff < 0) {
        const overdueHours = Math.abs(hoursDiff);
        if (overdueHours < 24) return `${taskType} (${overdueHours}h overdue)`;
        return `${taskType} (${Math.abs(daysDiff)}d overdue)`;
    }
    if (hoursDiff <= 24) return `${taskType} (${hoursDiff}h left)`;
    return `${taskType} (${daysDiff}d left)`;
};

/**
 * Get action button text based on task type
 */
const getActionText = (taskType) => {
    const actionMap = {
        'Not Verified': 'Verify Now',
        'Not Confirmed': 'Log Confirmation',
        'No-show Not Retargeted': 'Start Retarget',
        'Follow-up Overdue': 'Send Follow-up',
        'Call Back': 'Make Call',
        'Email Follow-up': 'Send Email',
        'Quote Expiring': 'Renew Quote',
        'Manual': 'Take Action',
        'Meeting Follow-up': 'Follow Up',
        'Proposal Follow-up': 'Follow Up',
        'Payment Follow-up': 'Check Payment',
        'Compliance Request': 'Review',
        'Document Request': 'Upload Document'
    };
    return actionMap[taskType] || 'Take Action';
};

/**
 * Safe JSON parser with error handling and logging
 */
const safeJsonParse = async (response, endpointName) => {
    // Get raw text
    const text = await response.text();
    
    // Log for debugging (truncated)
    console.log(`📡 ${endpointName} raw response (first 200 chars):`, text.substring(0, 200));
    console.log(`📋 ${endpointName} content-type:`, response.headers.get('content-type'));
    console.log(`📋 ${endpointName} status:`, response.status);
    
    // Check if empty
    if (!text || text.trim() === '') {
        throw new Error(`${endpointName} returned empty response`);
    }
    
    // Check if HTML (error page)
    if (text.trim().startsWith('<')) {
        console.error(`🔥 ${endpointName} returned HTML:`, text.substring(0, 500));
        
        // Try to extract error message from HTML
        const titleMatch = text.match(/<title>(.*?)<\/title>/i);
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        
        if (titleMatch) {
            throw new Error(`Server error: ${titleMatch[1]}`);
        }
        throw new Error(`${endpointName} returned HTML instead of JSON (Status: ${response.status})`);
    }
    
    // Try to parse JSON
    try {
        return JSON.parse(text);
    } catch (parseError) {
        console.error(`🔥 ${endpointName} JSON parse error:`, parseError);
        console.error(`🔥 First 100 chars:`, text.substring(0, 100));
        
        // Try to extract JSON if there's extra content (debug output before/after)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const extracted = JSON.parse(jsonMatch[0]);
                console.warn(`⚠️ ${endpointName} extracted JSON from mixed content`);
                return extracted;
            } catch (e) {
                // If extraction fails, continue to throw
            }
        }
        
        throw new Error(`${endpointName} returned invalid JSON: ${text.substring(0, 50)}...`);
    }
};

// ==================== SUB-COMPONENTS ====================

/**
 * Status badge component
 */
function StatusBadge({ status }) {
    const statusClass = status === 'Breached' ? 'breached' : 
                        status === 'Due Soon' ? 'due-soon' : 'active';
    
    return (
        <span className={`status-badge ${statusClass}`}>
            {status}
        </span>
    );
}

/**
 * Button component
 */
function Btn({ label, variant='primary', onClick, disabled = false }) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} ${disabled ? 'btn-disabled' : ''}`}
        >
            {label}
        </button>
    );
}

/**
 * Stat card component
 */
function StatCard({ label, value }) {
    return (
        <div className="stat-item">
            <p>{label}</p>
            <p>{value ?? '—'}</p>
        </div>
    );
}

/**
 * Tab button component
 */
function TabBtn({ label, active, onClick, count }) {
    return (
        <button 
            onClick={onClick}
            className={`tab-btn ${active ? 'active' : ''}`}
        >
            {label}
            {count !== undefined && <span className="tab-count">{count}</span>}
        </button>
    );
}

// ==================== SKELETON COMPONENTS ====================

/**
 * Skeleton loading animation
 */
function Skeleton({ width = '100%', height = 16, radius = 6 }) {
    return (
        <div 
            className="skeleton-pulse"
            style={{
                width, 
                height, 
                borderRadius: radius,
            }} 
        />
    );
}

/**
 * Stat card skeleton
 */
function StatCardSkeleton() {
    return (
        <div className="stat-item stat-item-skeleton">
            <Skeleton width="70%" height={13} />
            <Skeleton width="40%" height={28} radius={8} />
        </div>
    );
}

/**
 * Table row skeleton
 */
function SkeletonRow() {
    return (
        <tr style={{ borderBottom: '1px solid var(--brand-bg)' }}>
            <td style={{ padding: '16px' }}>
                <Skeleton width="80%" height={14} radius={4} />
                <div style={{ marginTop: 6 }}><Skeleton width="50%" height={11} radius={4} /></div>
            </td>
            <td style={{ padding: '16px' }}><Skeleton width="90%" height={14} radius={4} /></td>
            <td style={{ padding: '16px' }}><Skeleton width={80} height={26} radius={20} /></td>
            <td style={{ padding: '16px' }}><Skeleton width="70%" height={14} radius={4} /></td>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Skeleton width={64} height={32} radius={6} />
                    <Skeleton width={100} height={32} radius={6} />
                </div>
            </td>
        </tr>
    );
}

/**
 * Empty state component
 */
function EmptyState({ filtered }) {
    return (
        <tr>
            <td colSpan={5}>
                <div className="empty-state">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>
                        {filtered ? '🔍' : '✅'}
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#475569' }}>
                        {filtered ? 'No exceptions match this filter' : 'No exceptions right now'}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                        {filtered ? 'Try selecting a different filter above.' : 'All SLA and SOP rules are currently being met.'}
                    </p>
                </div>
            </td>
        </tr>
    );
}

/**
 * Error state component
 */
function ErrorState({ onRetry, errorMessage }) {
    return (
        <tr>
            <td colSpan={5}>
                <div className="empty-state">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                    <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#475569' }}>
                        Failed to load data
                    </p>
                    {errorMessage && (
                        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#ef4444', maxWidth: 400 }}>
                            {errorMessage}
                        </p>
                    )}
                    <button onClick={onRetry} className="btn btn-primary">
                        Try Again
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ==================== MAIN COMPONENT ====================

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [exceptions, setExceptions] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [actioningId, setActioningId] = useState(null);

    /**
     * Fetch all dashboard data
     */
    const fetchData = async () => {
        setLoading(true);
        setError(false);
        setErrorMessage('');

        try {
            // ========== FETCH STATS ==========
            console.log('🚀 Fetching stats from /api/dashboard/stats');
            
            const statsResponse = await fetch('/api/dashboard/stats', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'
            });

            if (!statsResponse.ok) {
                throw new Error(`Stats API returned ${statsResponse.status}: ${statsResponse.statusText}`);
            }

            const statsData = await safeJsonParse(statsResponse, 'Stats API');
            console.log('✅ Stats data received:', statsData);

            // ========== FETCH EXCEPTIONS ==========
            console.log('🚀 Fetching exceptions from /api/dashboard/exceptions');
            
            const exceptionsResponse = await fetch('/api/dashboard/exceptions', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'
            });

            if (!exceptionsResponse.ok) {
                throw new Error(`Exceptions API returned ${exceptionsResponse.status}: ${exceptionsResponse.statusText}`);
            }

            const exceptionsData = await safeJsonParse(exceptionsResponse, 'Exceptions API');
            console.log('✅ Exceptions data received:', exceptionsData);

            // ========== PROCESS DATA ==========
            
            // Process exceptions to add computed fields for display
            const processedExceptions = (exceptionsData || []).map(ex => {
                // Build lead name from contact profile
                const leadName = ex.contact_profile ? 
                    `${ex.contact_profile.first_name || ''} ${ex.contact_profile.last_name || ''}`.trim() || 'Unknown' : 
                    'Unknown';
                
                // Build reference from deal profile
                const ref = ex.deal_profile?.id ? 
                    `Deal #${ex.deal_profile.id}` : 
                    (ex.contact_profile?.id ? `Contact #${ex.contact_profile.id}` : 'Unknown');
                
                // Build owner name from employee and BU
                const owner = ex.employee_ref ? 
                    `${ex.employee_ref.name || ''} - ${ex.bu_ref?.code || ''}`.trim() || 'Unassigned' : 
                    'Unassigned';

                return {
                    id: ex.id || `temp-${Math.random()}`,
                    lead_name: leadName,
                    ref: ref,
                    exception_type: formatExceptionType(ex.task_type || 'Task', ex.due_date || new Date()),
                    sla_status: determineSlaStatus(ex.due_date || new Date(), ex.status || 'Open'),
                    owner: owner,
                    action: getActionText(ex.task_type || 'Manual'),
                    // Keep original data for action handling
                    task_id: ex.id,
                    task_type: ex.task_type,
                    deal_id: ex.deal_profile?.id,
                    contact_id: ex.contact_profile?.id
                };
            });

            setStats(statsData || {});
            setExceptions(processedExceptions);
            setLoading(false);
            
        } catch (err) {
            console.error('🔥 Error fetching data:', err);
            setError(true);
            setErrorMessage(err.message);
            setLoading(false);
            
            // Log to monitoring service if available
            if (window.errorTracker) {
                window.errorTracker.captureException(err);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter exceptions based on selected tab
    const filtered = filter === 'All' 
        ? exceptions 
        : exceptions.filter(e => e.sla_status === filter);

    // Calculate counts for each status
    const counts = {
        All: exceptions.length,
        Breached: exceptions.filter(e => e.sla_status === 'Breached').length,
        'Due Soon': exceptions.filter(e => e.sla_status === 'Due Soon').length,
    };

    /**
     * Handle open button click - navigate to deal detail
     */
    const handleOpen = (row) => {
        if (row.deal_id) {
            window.open(`/deals/${row.deal_id}`, '_blank');
        } else if (row.contact_id) {
            window.open(`/contacts/${row.contact_id}`, '_blank');
        } else {
            alert('No associated deal or contact found');
        }
    };

    /**
     * Handle action button click - perform task action
     */
    const handleAction = async (row) => {
        if (!row.task_id) {
            alert('No task ID available');
            return;
        }
        
        setActioningId(row.id);
        
        try {
            console.log(`🔄 Performing action for task ${row.task_id}: ${row.action}`);
            
            const response = await fetch(`/api/follow-up-tasks/${row.task_id}/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: row.action,
                    task_type: row.task_type
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Action failed: ${response.status} - ${errorText}`);
            }
            
            const result = await safeJsonParse(response, 'Action API');
            console.log('✅ Action completed:', result);
            
            // Refresh data after successful action
            await fetchData();
            
        } catch (err) {
            console.error('🔥 Error performing action:', err);
            alert(`Failed to perform action: ${err.message}`);
        } finally {
            setActioningId(null);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Stats Card */}
            <div className="stats-card">
                <h1>SOP Control Center</h1>
                <div className="stats-grid">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        <>
                            <StatCard label="Active Leads" value={stats?.active_leads} />
                            <StatCard label="Meetings Scheduled" value={stats?.meetings_scheduled} />
                            <StatCard label="No-Shows" value={stats?.no_shows} />
                            <StatCard label="Deals in Pipeline" value={stats?.deals_in_pipeline} />
                            <StatCard label="Closed Won" value={stats?.closed_won} />
                        </>
                    )}
                </div>
            </div>

            {/* Exceptions Table Card */}
            <div className="exceptions-card">
                <div className="exceptions-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <h2>SLA / SOP Exceptions</h2>
                        {!loading && !error && (
                            <span className={`exceptions-total ${counts[filter] > 0 ? 'exceptions-total--alert' : 'exceptions-total--ok'}`}>
                                {counts[filter]} total
                            </span>
                        )}
                    </div>
                    <div className="tab-group">
                        {['All', 'Breached', 'Due Soon'].map(f => (
                            <TabBtn 
                                key={f} 
                                label={f} 
                                active={filter === f} 
                                onClick={() => setFilter(f)}
                                count={loading || error ? undefined : counts[f]}
                            />
                        ))}
                        <button 
                            onClick={fetchData} 
                            className="btn-refresh" 
                            title="Refresh"
                            disabled={loading}
                        >
                            ↻
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="exceptions-table">
                        <thead>
                            <tr>
                                <th>Lead/Deal</th>
                                <th>Exception Type</th>
                                <th>SLA Status</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Loading state */}
                            {loading && Array(4).fill(0).map((_, i) => <SkeletonRow key={i} />)}

                            {/* Error state */}
                            {!loading && error && <ErrorState onRetry={fetchData} errorMessage={errorMessage} />}

                            {/* Empty states */}
                            {!loading && !error && exceptions.length === 0 && <EmptyState filtered={false} />}
                            {!loading && !error && exceptions.length > 0 && filtered.length === 0 && <EmptyState filtered={true} />}

                            {/* Data ready */}
                            {!loading && !error && filtered.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <p className="lead-info">{row.lead_name}</p>
                                        <p className="lead-ref">{row.ref}</p>
                                    </td>
                                    <td className="exception-type">{row.exception_type}</td>
                                    <td><StatusBadge status={row.sla_status} /></td>
                                    <td className="owner-name">{row.owner}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Btn 
                                                label="Open" 
                                                variant="primary" 
                                                onClick={() => handleOpen(row)} 
                                                disabled={actioningId === row.id}
                                            />
                                            <Btn 
                                                label={actioningId === row.id ? 'Working...' : row.action} 
                                                variant="accent" 
                                                onClick={() => handleAction(row)}
                                                disabled={actioningId === row.id}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer count */}
                {!loading && !error && filtered.length > 0 && (
                    <p className="table-footer">
                        Showing {filtered.length} of {exceptions.length} exceptions
                    </p>
                )}
            </div>
        </div>
    );
}
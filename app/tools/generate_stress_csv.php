<?php
// Run: php tools/generate_stress_csv.php
// Output: storage/app/stress_import_1000.csv

$outPath = __DIR__ . '/../storage/app/stress_import_1000.csv';
@mkdir(dirname($outPath), 0777, true);

$fp = fopen($outPath, 'w');

$header = [
  'company_name','company_source','company_classification','business_unit_id',
  'company_email','company_phone','company_website','company_address','industry_sector',
  'hubspot_id','contact_first_name','contact_last_name','contact_email','contact_mobile',
  'date_of_birth','contact_persona','contact_source',
  // Optional but useful for contact_profile constraint:
  'company_classification_contact'
];
fputcsv($fp, $header);

/**
 * ✅ Allowed values based on your SQL Server CHECK constraints:
 * contact_profile.contact_source:
 *   Etc | Purchased | Marketing | Sales | Linkedin | Apollo
 */
$contactSources = ['Etc','Purchased','Marketing','Sales','Linkedin','Apollo'];

/**
 * company_profile.company_source:
 * Keep as your DB expects.
 * NOTE: If your company_profile constraint uses 'etc' (lowercase) keep it.
 * If it uses 'Etc' (titlecase) switch to 'Etc'.
 */
$companySources = ['etc','Purchased','Marketing','Sales','Linkedin'];

/**
 * company_profile.company_classification (from your earlier company constraint list)
 */
$companyClassifications = [
  'Training-Institute','HigherED','Technology','Multinationals',
  'Corporate (> 1000)','Enterprise (200-1000)','SME (50-200)','mSME (< 50)'
];

/**
 * contact_profile.contact_persona (from your DB constraint list)
 */
$personas = [
  'Advanced Tech','Advanced Non-Tech Career','Mid Tech Career','Mid Non-Tech Career',
  'Early Tech Career','Early Non-Tech Career','Fresh Graduates','Average Students','Good Students'
];

/**
 * contact_profile.company_classification (from your DB constraint list)
 * (This is NOT the same as company_profile.company_classification)
 */
$contactCompanyClassifications = ['Technology','MNC','Corporate','SME'];

/**
 * Use company names with commas / periods to test CSV quoting behavior.
 */
$companies = [
  'ACME, Inc.',
  'Bright Future Sdn. Bhd.',
  'Global Tech Solutions',
  'NextGen Training Centre',
  'Retail Hub Malaysia',
  'Enterprise Alliance Partners',
  'Kuala Lumpur Tech Campus',
  'MNC Group APAC',
  'SME Growth Lab',
  'HigherED Institute'
];

for ($i = 1; $i <= 1000; $i++) {
  $companyName  = $companies[$i % count($companies)];
  $companySource = $companySources[$i % count($companySources)];
  $companyClass  = $companyClassifications[$i % count($companyClassifications)];

  // ⚠️ Must match your seeded bu_ref(bu_id).
  // If your bu_ref IDs are NOT 1,2,3 then set this to blank or to actual ids.
  $buId = ($i % 3) + 1; // 1..3

  $hubspot = 'HS' . str_pad((string)$i, 6, '0', STR_PAD_LEFT);
  $first   = 'User' . $i;
  $last    = 'Test';
  $email   = 'user' . $i . '@example.com';
  $mobile  = '01' . str_pad((string)($i % 100000000), 8, '0', STR_PAD_LEFT);

  $dobYear  = 1980 + ($i % 20); // 1980..1999
  $dobMonth = (($i % 12) + 1);
  $dobDay   = (($i % 28) + 1);
  $dob      = sprintf('%04d-%02d-%02d', $dobYear, $dobMonth, $dobDay);

  $persona       = $personas[$i % count($personas)];
  $contactSource = $contactSources[$i % count($contactSources)];

  // This is for contact_profile.company_classification constraint (Technology|MNC|Corporate|SME)
  $contactCompanyClass = $contactCompanyClassifications[$i % count($contactCompanyClassifications)];

  $row = [
    $companyName,
    $companySource,
    $companyClass,
    $buId,
    "contact{$i}@company.com",
    '01' . str_pad((string)(10000000 + ($i % 90000000)), 8, '0', STR_PAD_LEFT),
    'https://example.com',
    "Address Line {$i}, Malaysia",
    'Technology',

    $hubspot,
    $first,
    $last,
    $email,
    $mobile,
    $dob,
    $persona,
    $contactSource,

    $contactCompanyClass,
  ];

  fputcsv($fp, $row);
}

fclose($fp);

echo "Generated: {$outPath}\n";

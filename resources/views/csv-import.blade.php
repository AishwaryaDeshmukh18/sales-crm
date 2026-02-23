<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>CSV Import</title>

    @viteReactRefresh
    @vite('resources/js/pages/CsvImportPage.jsx')
</head>
<body style="margin:0;">
    <div id="root"></div>
</body>
</html>

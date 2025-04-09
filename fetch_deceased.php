<?php
// fetch_deceased.php
include 'db_connection.php';

$searchQuery = isset($_GET['query']) ? $_GET['query'] : '';

$sql = "
SELECT 
    d.id, 
    d.full_name, 
    a.asset_id, 
    a.latitude_start, 
    a.longitude_start
FROM deceased d
LEFT JOIN (
    SELECT 
        lot_id AS asset_id, 
        latitude_start, 
        longitude_start 
    FROM lots
    UNION
    SELECT 
        estate_id AS asset_id, 
        latitude_start, 
        longitude_start 
    FROM estates
) AS a ON d.location = a.asset_id
WHERE 
    d.full_name LIKE ? OR 
    d.first_name LIKE ? OR 
    d.middle_name LIKE ? OR 
    d.last_name LIKE ? OR 
    d.suffix LIKE ? OR 
    a.asset_id LIKE ?
";

$stmt = $conn->prepare($sql);
$searchTerm = "%" . $searchQuery . "%";
$stmt->bind_param("ssssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $assetId = $row["asset_id"];
    if (preg_match('/^\d[A-Z]\d+-\d+$/', $assetId)) {
        $row["location_display"] = formatLotId($assetId);
    } elseif (preg_match('/^E-[A-C]\d+$/', $assetId)) {
        $row["location_display"] = formatEstateId($assetId);
    } else {
        $row["location_display"] = "Unknown Location";
    }

    unset($row["asset_id"]); // optional: hide raw ID if not needed
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);

// Helpers

function formatLotId($lotId)
{
    $pattern = '/^(\d)([A-Z])(\d+)-(\d+)$/';
    if (preg_match($pattern, $lotId, $matches)) {
        $phase = $matches[1];
        $lawn = $matches[2];
        $row = $matches[3];
        $lot = $matches[4];
        return "Phase $phase Lawn $lawn Row $row Lot $lot";
    }
    return "Invalid Lot ID";
}

function formatEstateId($estateId)
{
    if (preg_match('/E-([A-C])(\d+)/', $estateId, $matches)) {
        return "Estate {$matches[1]} - {$matches[2]}";
    }
    return "Invalid Estate ID";
}

<?php
// fetch_deceased.php
include 'db_connection.php'; // Include your DB connection script

$searchQuery = isset($_GET['query']) ? $_GET['query'] : '';

$sql = "SELECT d.id, d.full_name, d.birth_date, d.death_date, g.lot_id, g.latitude_start, g.longitude_start
        FROM deceased d
        JOIN lots AS g ON d.location = g.lot_id
        WHERE d.full_name LIKE ? OR g.lot_id LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%" . $searchQuery . "%";
$stmt->bind_param("ss", $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $row["birth_date"] = displayDate($row["birth_date"]);
    $row["death_date"] = displayDate($row["death_date"]);
    $row["lot_id"] = formatLotId($row["lot_id"]);
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);

function formatLotId($lotId) {
  // Regular expression to match the components of the lot ID
  $pattern = '/^(\d)([A-Z])(\d+)-(\d+)$/';

  if (preg_match($pattern, $lotId, $matches)) {
      // Extracted components
      $phase = $matches[1];
      $lawn = $matches[2];
      $row = $matches[3];
      $lot = $matches[4];

      // Return the formatted string
      return "Phase $phase Lawn $lawn Row $row Lot $lot";
  } else {
      // Return a fallback for invalid lot IDs
      return "Invalid Lot ID";
  }
}

function displayDate($date) {
  return date("F j, Y", strtotime($date));
}

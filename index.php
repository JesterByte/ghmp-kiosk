<!doctype html>
<html lang="en" data-bs-theme="auto">

<head>
  <script src="assets/js/color-modes.js"></script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Green Haven Memorial Park Kiosk">
  <title>Green Haven Memorial Park</title>
  <link rel="shortcut icon" href="assets/brand/green_haven_memorial_park_logo.ico" type="image/x-icon">
  <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" integrity="sha512-Zcn6bjR/8RZbLEpLIeOwNtzREBAJnUKESxces60Mpoj+2okopSAcSUIUOseddDm0cxnGQzxIR7vJgsLZbdLE3w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body>
  <main class="container-fluid">
    <?php include_once "theme.html" ?>

    <div class="row">
      <div class="col-12 logo-container">
        <img src="assets/brand/green_haven_memorial_park_logo.png" alt="Green Haven Memorial Park Logo" class="logo">
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-center welcome-text">
        <h2>Find a Loved One</h2>
      </div>
    </div>

    <div class="row">
      <div class="col-12 search-container">
        <div class="search-wrapper">
          <input type="search" class="form-control search-input" id="search-bar"
            placeholder="Search by name..." aria-label="Search">
          <div class="suggestions-container" id="suggestions"></div>
        </div>
        <div class="spinner" id="loading-spinner"></div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="cards-container row mx-3" id="cards-container"></div>
      </div>
    </div>
  </main>

  <!-- Map Modal -->
  <div class="modal fade" id="mapModal" tabindex="-1" aria-labelledby="mapModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title" id="mapModalLabel">Directions</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
          <div id="map" style="height: 500px;"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <script src="assets/js/jquery.min.js"></script>
  <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
  <script src="assets/js/leaflet.js"></script>
  <script src="assets/js/leaflet-routing-machine.min.js"></script>
  <script src="assets/js/script.js"></script>
</body>

</html>
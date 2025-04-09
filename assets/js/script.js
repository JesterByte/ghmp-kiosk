$(document).ready(function () {
  const kioskLocation = [14.8713190, 120.9765669];
  let currentSearchQuery = "";
  let searchTimeout;
  let map;

  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const darkIcon = document.getElementById('darkIcon');
  const lightIcon = document.getElementById('lightIcon');

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  // Theme toggle click handler
  themeToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (theme === 'dark') {
      darkIcon.style.display = 'none';
      lightIcon.style.display = 'block';
    } else {
      darkIcon.style.display = 'block';
      lightIcon.style.display = 'none';
    }

    // Update map tiles if map exists
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 10);
    }
  }

  // Search input handler with debounce
  $("#search-bar").on("input", function () {
    const query = $(this).val().trim();
    currentSearchQuery = query;

    if (query.length < 2) {
      $("#suggestions").hide().empty();
      $("#cards-container").empty();
      return;
    }

    // Show loading spinner
    $("#loading-spinner").show();

    // Clear previous timeout
    clearTimeout(searchTimeout);

    // Set new timeout (debounce)
    searchTimeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  });

  // Fetch search suggestions
  function fetchSuggestions(query) {
    $.ajax({
      // url: "fetch_deceased.php",
      url: "https://group1.cs42a.com/ghmp-kiosk/fetch_deceased.php",
      method: "GET",
      data: {
        query: query
      },
      success: function (data) {
        // Hide loading spinner
        $("#loading-spinner").hide();

        // Parse data if needed
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.error("Invalid JSON response");
            return;
          }
        }

        if (!Array.isArray(data)) {
          return;
        }

        displaySuggestions(data);
      },
      error: function (xhr) {
        $("#loading-spinner").hide();
        console.error("AJAX Error:", xhr.responseText);
        $("#suggestions").html('<div class="suggestion-item">An error occurred. Please try again.</div>').show();
      }
    });
  }

  // Display search suggestions
  function displaySuggestions(suggestions) {
    const container = $("#suggestions");
    container.empty();

    if (suggestions.length === 0) {
      container.append('<div class="suggestion-item">No results found</div>');
    } else {
      suggestions.slice(0, 5).forEach(item => {
        container.append(`
            <div class="suggestion-item" 
                 data-lat="${item.latitude_start}" 
                 data-lng="${item.longitude_start}"
                 data-name="${item.full_name}"
                 data-location="${item.location_display}">
              <strong>${item.full_name}</strong><br>
              <small class="text-muted">${item.location_display}</small>
            </div>
          `);
      });
    }

    container.show();

    // Add click handler to suggestions
    $(".suggestion-item").on("click", function () {
      const name = $(this).data("name");
      const location = $(this).data("location");
      const lat = $(this).data("lat");
      const lng = $(this).data("lng");

      // Update search input
      $("#search-bar").val(`${name} (${location})`);
      $("#suggestions").hide();

      // Show the single result
      showSingleResult(name, location, lat, lng);
    });
  }

  // Show single result card
  function showSingleResult(name, location, lat, lng) {
    const container = $("#cards-container");
    container.empty().append(`
        <div class="col-12 col-md-8 col-lg-6 mx-auto">
          <div class="card mb-3 shadow-sm">
            <div class="card-body">
              <h3 class="card-title">${name}</h3>
              <p class="card-text"><strong>Location:</strong> ${location}</p>
              <button class="btn btn-success btn-show-map" 
                      data-name="${name}"
                      data-lat="${lat}" 
                      data-lng="${lng}">
                Show on Map
              </button>
            </div>
          </div>
        </div>
      `);

    // Add click handler to map button
    $(".btn-show-map").on("click", function () {
      const name = $(this).data("name");
      const lat = $(this).data("lat");
      const lng = $(this).data("lng");
      showMap(name, lat, lng);
    });
  }

  // Show map modal
  function showMap(name, graveLat, graveLng) {
    const mapModal = new bootstrap.Modal(document.getElementById('mapModal'));
    mapModal.show();

    // Initialize map after modal is shown
    $('#mapModal').off('shown.bs.modal').on('shown.bs.modal', function () {
      initMap(name, graveLat, graveLng);
    });
  }

  // Initialize Leaflet map
  function initMap(name, graveLat, graveLng) {
    // console.log("Map init:", name, graveLat, graveLng);

    // Remove existing map if it exists
    if (map) {
      map.remove();
    }

    map = L.map('map', {
      zoomControl: true,
      tap: !L.Browser.mobile
    }).setView([graveLat, graveLng], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Correctly define and use graveMarker with a permanent popup
    const graveMarker = L.marker([graveLat, graveLng], { draggable: false }).addTo(map)
      .bindPopup(`<strong>${name}</strong>`, { autoClose: false, closeOnClick: false });  // Disable auto-close and click-close

    graveMarker.openPopup();  // Open the popup immediately when the marker is added

    // Ensure map size is correct
    map.invalidateSize();

    // Add the kiosk marker (for reference)
    L.marker(kioskLocation, { draggable: false }).addTo(map)
      .bindPopup("You are here")
      .openPopup();

    L.Routing.control({
      waypoints: [
        L.latLng(kioskLocation[0], kioskLocation[1]),
        L.latLng(graveLat, graveLng)
      ],
      routeWhileDragging: false,  // Keep the route static while dragging
      draggableWaypoints: false,  // Prevent dragging waypoints
      addWaypoints: false,  // Prevent users from adding new waypoints
      show: false,
      lineOptions: {
        styles: [{
          color: '#2e7d32',
          opacity: 0.7,
          weight: 5
        }]
      }
    }).addTo(map);
  }

  // Hide suggestions when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.search-wrapper').length) {
      $('#suggestions').hide();
    }
  });
});

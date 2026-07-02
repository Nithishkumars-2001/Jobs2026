/* ============================================================
   Job Opportunity 2026 — Rendering & Search Logic
   ============================================================ */

function renderJobCard(job) {
  return `
    <div class="col-12 col-md-6 col-lg-4 job-item"
         data-title="${job.title.toLowerCase()}"
         data-company="${job.company.toLowerCase()}"
         data-skills="${job.skills.toLowerCase()}"
         data-location="${job.location.toLowerCase()}">
      <div class="job-card fade-in-up">
        <div class="job-top">
          <div class="company-logo">${job.logo}</div>
          <div>
            <h5>${job.title}</h5>
            <div class="company-name">${job.company}</div>
          </div>
        </div>
        <div class="job-meta">
          <span class="tag">📍 ${job.location}</span>
          <span class="tag exp">${job.experience}</span>
          <span class="tag type">${job.type}</span>
        </div>
        <p class="job-desc">${job.desc}</p>
        <div class="job-skills"><strong>Skills:</strong> ${job.skills}</div>
        ${job.salary ? `<div class="job-salary">💰 ${job.salary}</div>` : ""}
        <a href="${job.link}" target="_blank" rel="noopener noreferrer" class="apply-btn">Apply Now →</a>
      </div>
    </div>`;
}

function renderJobs(jobArray, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (jobArray.length === 0) {
    container.innerHTML = `<div class="col-12 no-results"><h4>No jobs found</h4><p>Try adjusting your search filters.</p></div>`;
    return;
  }
  container.innerHTML = jobArray.map(renderJobCard).join("");
}

function updateResultCount(countId, n, total) {
  const el = document.getElementById(countId);
  if (el) el.innerHTML = `Showing <strong>${n}</strong> of <strong>${total}</strong> jobs`;
}

/**
 * Wires up instant search/filter on a listing page.
 * jobData: array of job objects
 * containerId: id of the grid container
 * countId: id of the result-count element
 */
function initJobSearch(jobData, containerId, countId) {
  renderJobs(jobData, containerId);
  updateResultCount(countId, jobData.length, jobData.length);

  const searchInput = document.getElementById("searchInput");
  const locationSelect = document.getElementById("locationFilter");

  function applyFilters() {
    const q = (searchInput?.value || "").toLowerCase().trim();
    const loc = (locationSelect?.value || "").toLowerCase();

    const filtered = jobData.filter(job => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);
      const matchesLocation = !loc || job.location.toLowerCase().includes(loc);
      return matchesQuery && matchesLocation;
    });

    renderJobs(filtered, containerId);
    updateResultCount(countId, filtered.length, jobData.length);
  }

  searchInput?.addEventListener("input", applyFilters);
  locationSelect?.addEventListener("change", applyFilters);
}

/* Populate a <select> with unique locations from a job dataset */
function populateLocationFilter(jobData, selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  const cities = [...new Set(jobData.map(j => j.location.split(",")[0].trim()))].sort();
  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    select.appendChild(opt);
  });
}

/* Homepage: global search redirects to the right listing page with a query */
function initHomeSearch() {
  const form = document.getElementById("homeSearchForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const q = document.getElementById("homeSearchInput").value.trim();
    const target = document.getElementById("homeSearchLevel").value;
    window.location.href = `${target}?q=${encodeURIComponent(q)}`;
  });
}

/* On listing pages: read ?q= from URL and pre-fill the search box */
function prefillSearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    const input = document.getElementById("searchInput");
    if (input) {
      input.value = q;
      input.dispatchEvent(new Event("input"));
    }
  }
}

/* Homepage: render featured jobs (mix from all levels) */
function renderFeaturedJobs(containerId, count = 6) {
  const pool = [
    ...(typeof freshersJobs !== "undefined" ? freshersJobs.slice(0, 4) : []),
    ...(typeof midJobs !== "undefined" ? midJobs.slice(0, 4) : []),
    ...(typeof seniorJobs !== "undefined" ? seniorJobs.slice(0, 4) : [])
  ];
  const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, count);
  renderJobs(shuffled, containerId);
}

/* Homepage: latest jobs (most recently added — here, first N of mid list as example) */
function renderLatestJobs(containerId, count = 6) {
  const pool = [
    ...(typeof freshersJobs !== "undefined" ? freshersJobs.slice(-3) : []),
    ...(typeof midJobs !== "undefined" ? midJobs.slice(-3) : [])
  ];
  renderJobs(pool.slice(0, count), containerId);
}

document.addEventListener("DOMContentLoaded", function () {
  initHomeSearch();
});

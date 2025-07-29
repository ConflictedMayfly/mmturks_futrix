document.addEventListener('DOMContentLoaded', function () {
    // --- Debounce helper function ---
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };
    
    // --- DOM Elements ---
    const dom = {
        mapContainer: document.getElementById('map-container'),
        markerContainer: document.getElementById('marker-container'),
        heatmapContainer: document.getElementById('heatmap-container'),
        poiMarkerContainer: document.getElementById('poi-marker-container'),
        l2FilterContainer: document.getElementById('l2-filter-container'),
        listingsResultsContainer: document.getElementById('listings-results-container'),
        l1Filters: document.getElementById('l1_filters'),
        heatmapToggles: null, // Will be selected after dynamic render
        thresholdToggleBtn: null, // Will be selected after dynamic render
        rippleContainer: document.getElementById('ripple-container'),
        backToAllBtn: document.getElementById('back-to-all-btn'),
        addEventBtn: document.getElementById('add-event-btn'),
        eventSearchOverlay: document.getElementById('event-search-overlay'),
        eventSearchInput: document.getElementById('event-search-input'),
        eventSearchResults: document.getElementById('event-search-results'),
    };

    // --- State & Config ---
    let activeHeatmapZones = [];
    let configuredHeatmapData = { attractions: [], connectivity: [], amenities: [], culture: [] };
    let holdTimeout, rippleElement;
    let isVicinitySearchActive = false;
    let vicinityCircle = { center: { x: 0, y: 0 }, radius: 0 };
    let mapAspectRatio = 1;

    // --- Initialization ---
    const init = () => {
        const mapRect = dom.mapContainer.getBoundingClientRect();
        mapAspectRatio = mapRect.width / mapRect.height;

        renderL1Filters(); 
        
        dom.heatmapToggles = document.querySelectorAll('.heatmap-toggle');
        dom.thresholdToggleBtn = document.getElementById('threshold-toggle-btn');
        
        renderMarkers();
        renderL2Filters();
        renderAllListings(Object.keys(propertyData));
        addEventListeners();
    };

    // --- NEW --- Renders search results for live events
    const renderSearchResults = (results) => {
        const html = results.map(eventName => `
            <div class="p-2 rounded-md cursor-pointer hover:bg-gray-200 event-result-item" data-event-name="${eventName}">
                ${eventName}
            </div>
        `).join('');
        dom.eventSearchResults.innerHTML = html;
    };

        const addEventAsFilter = (eventName) => {
            if (document.querySelector(`.bubble-btn[data-name="${eventName}"]`)) return; // Prevent adding duplicates

            const eventData = mockEventData[eventName];
            if (!eventData) return;

            // Add the event's data to the POI data source so it can be found by the filter logic.
            poiData.attractions[eventName] = { ...eventData };

            // Create the new event bubble and add it to the DOM.
            const attractionsContainer = document.getElementById('attractions-subfilters');
            const newBubbleHTML = `
                <button class="bubble-btn" data-name="${eventName}" data-type="attractions" data-is-event="true">
                    <i class="fa-solid ${eventData.icon}"></i>
                    <span>${eventName}</span>
                    <i class="remove-event-btn">&times;</i>
                </button>
            `;
            attractionsContainer.insertAdjacentHTML('beforeend', newBubbleHTML);

            // Hide the search overlay.
            dom.eventSearchOverlay.classList.add('hidden');
            dom.eventSearchInput.value = '';
            dom.eventSearchResults.innerHTML = '';

            const newButton = attractionsContainer.querySelector(`.bubble-btn[data-name="${eventName}"]`);
            if (newButton) {
                newButton.click();
            }
        };

    // --- Render Functions ---
    const renderMarkers = () => {
        dom.markerContainer.innerHTML = Object.keys(propertyData).map(id => {
            const p = propertyData[id];
            return `<a href="${p.url}" target="_blank" class="property-marker" data-id="${id}" style="left: ${p.x}%; top: ${p.y}%;"><i class="fa-solid fa-bed"></i> ₹${parseInt(p.price).toLocaleString('en-IN')}</a>`;
        }).join('');
    };

    const renderAllListings = (propertyIds) => {
        if (!dom.listingsResultsContainer) return;
        
        dom.listingsResultsContainer.innerHTML = propertyIds.length > 0 ? propertyIds.map(id => {
            const p = propertyData[id];
            if (!p) return '';

            const ratingText = p.rating >= 4.3 ? 'Excellent' : p.rating >= 3.7 ? 'Very Good' : 'Good';
            const stars = '★'.repeat(p.starRating) + '☆'.repeat(5 - p.starRating);

            return `
            <a href="${p.url}" target="_blank" class="property-tile">
                <div class="property-tile-content">
                    <img src="${p.img}" alt="${p.name}" class="property-tile-img" onerror="this.src='https://placehold.co/110x110/e0e0e0/ffffff?text=Image';">
                    <div class="property-tile-details">
                        <div class="property-tile-header">
                            <div>
                                <div class="property-tile-name">${p.name}</div>
                                <div class="property-tile-stars">${stars}</div>
                                <div class="property-tile-location">${p.tags[0]} | 5 mins walk to MRT</div>
                            </div>
                            <div class="property-tile-pricing">
                                <span class="rating-text">${ratingText}</span>
                                <span class="rating-box">${p.rating.toFixed(1)}</span>
                                <div class="rating-reviews">(${p.reviews.toLocaleString()} Ratings)</div>
                                <div class="property-price">₹${parseInt(p.price).toLocaleString('en-IN')}</div>
                                <div class="property-price-subtext">+ ₹${(p.price * 0.1).toLocaleString()} taxes & fees</div>
                                <div class="property-price-subtext">Per Night</div>
                            </div>
                        </div>
                        <div class="property-tile-tags">
                            ${p.tags.slice(1, 4).map(tag => `<span class="property-tile-tag"><i class="fa-solid fa-check"></i>${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="property-tile-footer">
                    ${p.desc}
                </div>
            </a>`;
        }).join('') : '<p class="text-center text-gray-500 p-8">No properties match your current filters.</p>';
    };

    const renderL2Filters = () => {
        if (!filterConfig) return;
        const createOptions = (filterName, options, isMultiSelect = true) => options.map(opt => {
            const value = isMultiSelect ? opt : opt.value;
            const label = isMultiSelect ? opt : opt.label;
            return `<label class="filter-option"><input type="checkbox" class="l2-filter-checkbox" data-filter="${filterName}" value="${value}"><span>${label}</span></label>`;
        }).join('');
        document.getElementById('star-rating-panel').innerHTML = createOptions('starRating', filterConfig.starRating, false);
        document.getElementById('user-rating-panel').innerHTML = createOptions('userRating', filterConfig.userRating, false);
        document.getElementById('property-type-panel').innerHTML = createOptions('propertyType', filterConfig.propertyType);
        document.getElementById('amenities-panel').innerHTML = createOptions('amenities', filterConfig.amenities);
    };
    
    const renderAllHeatmaps = () => {
        const oldZones = dom.heatmapContainer.querySelectorAll('.heatmap-overlay');
        oldZones.forEach(zone => zone.classList.add('exiting'));

        setTimeout(() => {
            dom.heatmapContainer.innerHTML = '';
            let zonesToDisplay = [];
            const activeToggles = Array.from(dom.heatmapToggles).filter(t => t.classList.contains('active'));
        
            if (activeToggles.length > 1) {
                let allActiveZones = [];
                let maxZonesInACategory = 0;
        
                activeToggles.forEach(toggle => {
                    const type = toggle.dataset.heatmap;
                    const zones = configuredHeatmapData[type];
                    if (zones.length > maxZonesInACategory) maxZonesInACategory = zones.length;
                    allActiveZones.push(...zones);
                });
                
                const targetZoneCount = Math.max(1, maxZonesInACategory - 1); 
                zonesToDisplay = mergeZones(allActiveZones, targetZoneCount);
        
            } else if (activeToggles.length === 1) {
                const type = activeToggles[0].dataset.heatmap;
                zonesToDisplay = configuredHeatmapData[type];
            }
        
            activeHeatmapZones = zonesToDisplay || [];
            const html = activeHeatmapZones.map(zone => {
                const size = zone.radius * 2; 
                return `<div class="heatmap-overlay" style="left: ${zone.x}%; top: ${zone.y}%; width: ${size}%;"></div>`;
            }).join('');
        
            dom.heatmapContainer.innerHTML = html;
            updateView();
        }, 300);
    };

    const renderL1Filters = () => {
        if (!dom.l1Filters || !l1FilterConfig || !poiData) return;

        const filterHTML = Object.keys(l1FilterConfig).map(key => {
            const config = l1FilterConfig[key];
            const subfilterData = poiData[config.dataKey] || {};

            const subfilterBubblesHTML = Object.keys(subfilterData).map(name => {
                const item = subfilterData[name];
                const icon = item.icon || (Array.isArray(item) && item.length > 0 ? item[0].icon : 'fa-circle');
                return `<button class="bubble-btn" data-name="${name}" data-type="${key}"><i class="fa-solid ${icon}"></i><span>${name}</span></button>`;
            }).join('');

            const addEventButtonHTML = key === 'attractions' ? '<button id="add-event-btn" class="text-sm text-blue-500 hover:text-blue-400 w-full text-left mt-2">+ Add Live Events</button>' : '';
    
            return `
                <div class="filter-popup-container">
                    <button class="heatmap-toggle bg-white hover:bg-opacity-75 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all" data-heatmap="${key}" title="${config.title}">
                        <i class="fa-solid ${config.icon} text-xl"></i>
                    </button>
                    <div class="filter-popup">
                        <div class="glassy p-4">
                            <p class="font-bold mb-3">${config.title}</p>
                            <div id="${key}-subfilters" class="flex flex-wrap gap-2">
                                ${subfilterBubblesHTML}
                            </div>
                            ${addEventButtonHTML}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        dom.l1Filters.innerHTML = `
            ${filterHTML}
            <div class="w-8 h-px bg-gray-400 opacity-50 my-2"></div>
            <button id="threshold-toggle-btn" class="bg-white hover:bg-opacity-75 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all" title="Toggle Threshold"><i class="fa-solid fa-sliders text-xl"></i></button>
        `;
    
        // Re-assign the add event button after rendering
        dom.addEventBtn = document.getElementById('add-event-btn');
    };
    
    // --- Core Logic ---
    const getCorrectedDistance = (p1, p2) => {
        const dx = p1.x - p2.x;
        const dy = (p1.y - p2.y) / mapAspectRatio;
        return Math.sqrt(dx**2 + dy**2);
    };
    
    const mergeZones = (zones, targetCount) => {
        if (zones.length <= targetCount || targetCount < 1) return zones.map(z => ({...z, type: 'merged'}));
        let merged = [...zones];
        while(merged.length > targetCount) {
            let closestDist = Infinity, pairToMerge = [-1, -1];
            for(let i=0; i<merged.length; i++) for(let j=i+1; j<merged.length; j++) {
                const dist = getCorrectedDistance(merged[i], merged[j]);
                if(dist < closestDist) { closestDist = dist; pairToMerge = [i, j]; }
            }
            const [i, j] = pairToMerge;
            
            const item1 = merged[i];
            const item2 = merged[j];
            const r1 = item1.radius;
            const r2 = item2.radius;
            const area1 = r1**2;
            const area2 = r2**2;
            const totalArea = area1 + area2;

            const newZone = { 
                x: (item1.x * area1 + item2.x * area2) / totalArea, 
                y: (item1.y * area1 + item2.y * area2) / totalArea, 
                radius: Math.sqrt(totalArea), 
                type: 'merged'
            };
            merged.splice(j, 1); merged.splice(i, 1); merged.push(newZone);
        }
        return merged;
    };
    
    const updateView = () => {
        if (isVicinitySearchActive) {
            const radiusPercent = (vicinityCircle.radius / dom.mapContainer.getBoundingClientRect().width) * 100;
            const vicinityIds = Object.keys(propertyData).filter(id => {
                const p = propertyData[id];
                return getCorrectedDistance(p, vicinityCircle.center) < radiusPercent;
            });
            renderAllListings(vicinityIds);
            updateMarkersVisibility(vicinityIds);
            return;
        }

        const isThresholdActive = dom.thresholdToggleBtn.classList.contains('active');
        let filteredIds = Object.keys(propertyData);

        if (isThresholdActive && activeHeatmapZones.length > 0) {
            filteredIds = filteredIds.filter(id => {
                const p = propertyData[id];
                return activeHeatmapZones.some(zone => getCorrectedDistance(p, zone) < zone.radius);
            });
        }

        const priceMin = parseFloat(document.getElementById('price-min').value) || 0;
        const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity;
        const getSelectedValues = (filterName) => Array.from(document.querySelectorAll(`[data-filter="${filterName}"]:checked`)).map(cb => cb.value);
        const selectedStars = getSelectedValues('starRating').map(s => parseInt(s));
        const selectedRatings = getSelectedValues('userRating').map(r => parseFloat(r));
        const selectedTypes = getSelectedValues('propertyType');
        const selectedAmenities = getSelectedValues('amenities');

        filteredIds = filteredIds.filter(id => {
            const p = propertyData[id];
            if (parseFloat(p.price) < priceMin || parseFloat(p.price) > priceMax) return false;
            if (selectedStars.length > 0 && !selectedStars.includes(p.starRating)) return false;
            if (selectedTypes.length > 0 && !selectedTypes.includes(p.propertyType)) return false;
            if (selectedRatings.length > 0 && !selectedRatings.some(r => p.rating >= r)) return false;
            if (selectedAmenities.length > 0 && !selectedAmenities.every(a => p.tags.includes(a) || p.name.includes(a))) return false;
            return true;
        });
        
        renderAllListings(filteredIds);
        updateMarkersVisibility(filteredIds);
    };

    const updateMarkersVisibility = (visibleIds) => {
        document.querySelectorAll('.property-marker').forEach(marker => {
            const id = marker.dataset.id;
            marker.classList.toggle('hidden', !visibleIds.includes(id));
        });
    };
    
    const updateSelectionTiles = (filterType) => {
        const container = document.querySelector(`.filter-dropdown-container[data-filter-type="${filterType}"]`);
        if (!container) return;
        const optionsContainer = container.querySelector('.selected-options-container');
        const placeholder = optionsContainer.querySelector('.placeholder');
        const checkedInputs = Array.from(container.querySelectorAll('.l2-filter-checkbox:checked'));
        optionsContainer.querySelectorAll('.selection-tile').forEach(tile => tile.remove());
        if (checkedInputs.length > 0) {
            placeholder.style.display = 'none';
            checkedInputs.forEach(input => {
                const label = input.parentElement.querySelector('span').textContent;
                optionsContainer.insertAdjacentHTML('beforeend', `<div class="selection-tile" data-value="${input.value}">${label}<i class="remove-tile-btn">&times;</i></div>`);
            });
        } else {
            placeholder.style.display = 'inline';
        }
    };

    // --- Event Listeners ---
    function addEventListeners() {
        const debouncedUpdateView = debounce(updateView, 500);

        const startHold = (e) => {
            e.preventDefault();
            const rect = dom.mapContainer.getBoundingClientRect();
            const x = ((e.clientX || e.touches[0].clientX) - rect.left);
            const y = ((e.clientY || e.touches[0].clientY) - rect.top);
            holdTimeout = setTimeout(() => {
                dom.rippleContainer.innerHTML = `<div class="ripple" style="left: ${x}px; top: ${y}px;"></div>`;
                rippleElement = dom.rippleContainer.querySelector('.ripple');
            }, 500);
        };

        const endHold = () => {
            clearTimeout(holdTimeout);
            if (rippleElement) {
                const rect = dom.mapContainer.getBoundingClientRect();
                isVicinitySearchActive = true;
                vicinityCircle.center = {
                    x: (rippleElement.offsetLeft / rect.width) * 100,
                    y: (rippleElement.offsetTop / rect.height) * 100
                };
                vicinityCircle.radius = rippleElement.offsetWidth / 2;
                dom.rippleContainer.innerHTML = '';
                rippleElement = null;
                dom.l2FilterContainer.classList.add('hidden');
                dom.backToAllBtn.classList.remove('hidden');
                updateView();
            }
        };

        dom.mapContainer.addEventListener('mousedown', startHold);
        dom.mapContainer.addEventListener('mouseup', endHold);
        dom.mapContainer.addEventListener('mouseleave', () => clearTimeout(holdTimeout));
        dom.mapContainer.addEventListener('touchstart', startHold, { passive: true });
        dom.mapContainer.addEventListener('touchend', endHold);

        dom.backToAllBtn.addEventListener('click', () => {
            isVicinitySearchActive = false;
            dom.l2FilterContainer.classList.remove('hidden');
            dom.backToAllBtn.classList.add('hidden');
            updateView();
        });

        if (dom.l1Filters) {
            dom.l1Filters.addEventListener('click', (e) => {
                const heatmapToggle = e.target.closest('.heatmap-toggle');
                const thresholdToggle = e.target.closest('#threshold-toggle-btn');
                
                if (heatmapToggle) {
                    heatmapToggle.classList.toggle('active');
                    renderAllHeatmaps();
                    return;
                }
    
                if (thresholdToggle) {
                    thresholdToggle.classList.toggle('active');
                    updateView();
                    return;
                }
            });
        }
    
        const updateL1FilterConfig = (type) => {
            Object.keys(l1FilterConfig).forEach(key => {
                const config = l1FilterConfig[key];
                const subfilterContainerId = `#${key}-subfilters`;
                const activeSubfilterButtons = document.querySelectorAll(`${subfilterContainerId} .bubble-btn.active`);

                if (key === 'amenities' || key === 'connectivity') {
                    configuredHeatmapData[key] = Array.from(activeSubfilterButtons).flatMap(btn => {
                        const subfilterName = btn.dataset.name;
                        const data = poiData[config.dataKey][subfilterName];
                        const points = data.points || data; 
                        return points.map(point => ({ ...point, type: key }));
                    });
                } else {
                    configuredHeatmapData[key] = Array.from(activeSubfilterButtons).map(btn => ({ 
                        ...poiData[config.dataKey][btn.dataset.name], 
                        type: key 
                    }));
                }
            });

            const mainToggle = document.querySelector(`.heatmap-toggle[data-heatmap="${type}"]`);
            if (mainToggle && mainToggle.classList.contains('active')) {
                renderAllHeatmaps();
            }
        };
    
        document.querySelectorAll('.filter-popup-container').forEach(container => {
            const popup = container.querySelector('.filter-popup');
            if (!popup) return;
            let showTimeout, hideTimeout;
            const enterCallback = () => { clearTimeout(hideTimeout); showTimeout = setTimeout(() => popup.classList.add('visible'), 500); };
            const leaveCallback = () => { clearTimeout(showTimeout); hideTimeout = setTimeout(() => popup.classList.remove('visible'), 200); };

            container.addEventListener('mouseenter', enterCallback);
            container.addEventListener('mouseleave', leaveCallback);
    
            const type = container.querySelector('.heatmap-toggle').dataset.heatmap;
            popup.addEventListener('click', e => {
                const bubbleBtn = e.target.closest('.bubble-btn');

                if (e.target.closest('#add-event-btn') || e.target.closest('.remove-event-btn')) {
                    // This click is handled by another listener, so ignore it here.
                    return;
                }

                if (bubbleBtn) {
                    bubbleBtn.classList.toggle('active');
                    updateL1FilterConfig(type);
                }
            });

            // --- NEW --- Dedicated listener for the remove button on event bubbles
            popup.addEventListener('click', e => {
                if (e.target.classList.contains('remove-event-btn')) {
                    const eventBubble = e.target.closest('.bubble-btn');
                    if (eventBubble) {
                        const eventName = eventBubble.dataset.name;
                        delete poiData.attractions[eventName]; // Remove from data
                        eventBubble.remove(); // Remove from DOM
                        updateL1FilterConfig('attractions'); // Update the map
                    }
                }
            });
        });

        // --- NEW --- Event listeners for the event search functionality
        document.body.addEventListener('click', (e) => {
             if (e.target && e.target.id === 'add-event-btn') {
                e.stopPropagation();
                dom.eventSearchOverlay.classList.remove('hidden');
                dom.eventSearchInput.focus();
            }
        });

    
        dom.eventSearchOverlay.addEventListener('click', (e) => {
            if (e.target === dom.eventSearchOverlay) {
                dom.eventSearchOverlay.classList.add('hidden');
            }
        });
    
        dom.eventSearchInput.addEventListener('input', debounce(() => {
            const query = dom.eventSearchInput.value.toLowerCase().trim();
            if (!query) {
                dom.eventSearchResults.innerHTML = '';
                return;
            }
            const results = Object.keys(mockEventData).filter(eventName =>
                eventName.toLowerCase().includes(query)
            );
            renderSearchResults(results);
        }, 300));

        dom.eventSearchResults.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.event-result-item');
            if (resultItem) {
                const eventName = resultItem.dataset.eventName;
                addEventAsFilter(eventName);
            }
        });
    
        if (dom.l2FilterContainer) {
            dom.l2FilterContainer.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.remove-tile-btn');
                if (removeBtn) {
                    e.stopPropagation();
                    const tile = removeBtn.closest('.selection-tile');
                    const value = tile.dataset.value;
                    const container = tile.closest('.filter-dropdown-container');
                    const filterType = container.dataset.filterType;
                    const checkboxToUncheck = container.querySelector(`input[value="${value}"]`);
                    if (checkboxToUncheck) checkboxToUncheck.checked = false;
                    updateSelectionTiles(filterType);
                    updateView();
                }
            });
            dom.l2FilterContainer.addEventListener('change', e => { if (e.target.classList.contains('l2-filter-checkbox')) { updateSelectionTiles(e.target.closest('.filter-dropdown-container').dataset.filterType); updateView(); } });
            dom.l2FilterContainer.addEventListener('input', e => { if (e.target.classList.contains('price-input')) debouncedUpdateView(); });
        }
    
        document.addEventListener('click', (e) => {
            const l2Toggle = e.target.closest('.filter-dropdown-toggle'), l2Panel = e.target.closest('.filter-dropdown-panel');
            if (!l2Toggle && !l2Panel) {
                document.querySelectorAll('.filter-dropdown-toggle.open').forEach(openToggle => {
                    openToggle.classList.remove('open');
                    document.getElementById(openToggle.dataset.target)?.classList.remove('open');
                });
            } else if (l2Toggle) {
                const targetPanel = document.getElementById(l2Toggle.dataset.target);
                l2Toggle.classList.toggle('open');
                targetPanel?.classList.toggle('open');
            }
        });
    }

    init();
});
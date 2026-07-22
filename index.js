/*
 * Mobile-first navigation layer for the Hotel Italia Palace virtual tour.
 * Marzipano remains responsible only for panorama rendering.
 */
'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var data = window.APP_DATA;
  var config = window.TOUR_CONFIG;
  var variants = window.TOUR_VARIANTS || {};

  if (!Marzipano || !data || !config) {
    throw new Error('The tour could not start because a required resource is missing.');
  }

  var elements = {
    pano: document.querySelector('#pano'),
    desktopTourTitle: document.querySelector('#desktopTourTitle'),
    mobileTourTitle: document.querySelector('#mobileTourTitle'),
    desktopRelatedTours: document.querySelector('#desktopRelatedTours'),
    mobileRelatedTours: document.querySelector('#mobileRelatedTours'),
    desktopNavigation: document.querySelector('#tourNavigation'),
    mobileNavigation: document.querySelector('#mobileNavigation'),
    currentGroup: document.querySelector('#currentGroup'),
    currentScene: document.querySelector('#currentScene'),
    desktopPrevious: document.querySelector('#desktopPrevious'),
    desktopNext: document.querySelector('#desktopNext'),
    mobilePrevious: document.querySelector('#mobilePrevious'),
    mobileNext: document.querySelector('#mobileNext'),
    mobileExplore: document.querySelector('#mobileExplore'),
    mobileSheet: document.querySelector('#mobileSheet'),
    sheetBackdrop: document.querySelector('#sheetBackdrop'),
    closeSheet: document.querySelector('#closeSheet'),
    motionToggle: document.querySelector('#motionToggle'),
    motionLabel: document.querySelector('.motion-label'),
    loadingStatus: document.querySelector('#loadingStatus')
  };

  var sceneDataById = Object.create(null);
  data.scenes.forEach(function(sceneData) {
    sceneDataById[sceneData.id] = sceneData;
  });

  var activeVariant = selectVariant();
  var groups = normalizeGroups(resolveVariantGroups(activeVariant.groups));
  var route = [];
  var groupBySceneId = Object.create(null);
  groups.forEach(function(group) {
    group.scenes.forEach(function(sceneId) {
      route.push(sceneId);
      groupBySceneId[sceneId] = group;
    });
  });

  var viewer = new Marzipano.Viewer(elements.pano, {
    controls: { mouseViewMode: data.settings.mouseViewMode }
  });

  var sceneById = Object.create(null);
  data.scenes.filter(function(sceneData) {
    return Boolean(groupBySceneId[sceneData.id]);
  }).forEach(function(sceneData) {
    var source = Marzipano.ImageUrlSource.fromString(
      'tiles/' + sceneData.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: 'tiles/' + sceneData.id + '/preview.jpg' }
    );
    var geometry = new Marzipano.CubeGeometry(sceneData.levels);
    var limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize,
      100 * Math.PI / 180,
      120 * Math.PI / 180
    );
    var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);
    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      // Loading every scene's first level at startup creates hundreds of
      // unnecessary mobile requests. Only the active panorama is fetched.
      pinFirstLevel: false
    });

    // Existing or future spatial links in data.js remain supported and inherit
    // the same accessible, custom appearance as the route navigation.
    sceneData.linkHotspots.forEach(function(hotspot) {
      var hotspotElement = createPanoramaLink(hotspot);
      scene.hotspotContainer().createHotspot(hotspotElement, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch
      });
    });

    sceneById[sceneData.id] = {
      data: sceneData,
      scene: scene,
      view: view
    };
  });

  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.025,
    targetPitch: 0,
    targetFov: Math.PI / 2
  });
  var motionEnabled = false;
  var currentSceneId = null;
  var sheetCloseTimer = null;

  elements.desktopTourTitle.textContent = activeVariant.title;
  elements.mobileTourTitle.textContent = activeVariant.title + ' · Virtual Tour';
  document.documentElement.dataset.tour = activeVariant.id;
  buildRelatedTours(elements.desktopRelatedTours);
  buildRelatedTours(elements.mobileRelatedTours);
  buildNavigation(elements.desktopNavigation, false);
  buildNavigation(elements.mobileNavigation, true);
  bindControls();

  var initialSceneId = sceneIdFromUrl();
  if (!sceneById[initialSceneId]) {
    initialSceneId = route[0];
  }
  switchScene(initialSceneId, { replaceHistory: true, immediate: true });

  function selectVariant() {
    var match = window.location.search.match(/[?&]tour=([^&]+)/);
    var requestedId = match ? decodeURIComponent(match[1]) : 'all';
    return variants[requestedId] || variants.all || {
      id: 'all',
      title: 'Virtual Tour',
      groups: null,
      relatedTours: []
    };
  }

  function resolveVariantGroups(groupDefinitions) {
    if (!Array.isArray(groupDefinitions)) {
      return config.groups;
    }
    return groupDefinitions.map(function(definition) {
      if (typeof definition !== 'string') {
        return definition;
      }
      for (var i = 0; i < config.groups.length; i++) {
        if (config.groups[i].id === definition) {
          return config.groups[i];
        }
      }
      return null;
    }).filter(Boolean);
  }

  function normalizeGroups(rawGroups) {
    var known = Object.create(null);
    var normalized = rawGroups.map(function(group) {
      var validScenes = group.scenes.filter(function(sceneId) {
        if (!sceneDataById[sceneId] || known[sceneId]) {
          return false;
        }
        known[sceneId] = true;
        return true;
      });
      return { id: group.id, label: group.label, scenes: validScenes };
    }).filter(function(group) {
      return group.scenes.length > 0;
    });

    if (activeVariant.includeUngrouped) {
      var ungrouped = data.scenes.filter(function(sceneData) {
        return !known[sceneData.id];
      }).map(function(sceneData) {
        return sceneData.id;
      });
      if (ungrouped.length) {
        normalized.push({ id: 'other-areas', label: 'Other areas', scenes: ungrouped });
      }
    }
    return normalized;
  }

  function buildRelatedTours(container) {
    var relatedTours = activeVariant.relatedTours || [];
    if (!relatedTours.length) {
      container.hidden = true;
      return;
    }

    relatedTours.forEach(function(tour) {
      var link = document.createElement('a');
      link.className = 'tour-switch-link';
      link.href = tour.href;
      link.setAttribute('aria-label', 'Open ' + tour.label + ' virtual tour');

      var caption = document.createElement('span');
      caption.textContent = 'Open tour';
      var label = document.createElement('strong');
      label.textContent = tour.label;
      var arrow = document.createElement('i');
      arrow.setAttribute('aria-hidden', 'true');
      link.appendChild(caption);
      link.appendChild(label);
      link.appendChild(arrow);
      container.appendChild(link);
    });
  }

  function buildNavigation(container, mobile) {
    var fragment = document.createDocumentFragment();
    groups.forEach(function(group, groupIndex) {
      var details = document.createElement('details');
      details.className = 'navigation-group';
      details.dataset.groupId = group.id;
      if (groupIndex === 0) {
        details.open = true;
      }

      var summary = document.createElement('summary');
      var label = document.createElement('span');
      label.textContent = group.label;
      var count = document.createElement('span');
      count.className = 'group-count';
      count.textContent = String(group.scenes.length).padStart(2, '0');
      summary.appendChild(label);
      summary.appendChild(count);
      details.appendChild(summary);

      var sceneList = document.createElement('div');
      sceneList.className = 'navigation-scenes';
      group.scenes.forEach(function(sceneId, sceneIndex) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'scene-link';
        button.dataset.sceneId = sceneId;

        var number = document.createElement('span');
        number.className = 'scene-number';
        number.textContent = String(sceneIndex + 1).padStart(2, '0');
        var name = document.createElement('span');
        name.className = 'scene-link-name';
        name.textContent = sceneName(sceneId);
        button.appendChild(number);
        button.appendChild(name);

        button.addEventListener('click', function() {
          switchScene(sceneId);
          if (mobile) {
            closeMobileSheet();
          }
        });
        sceneList.appendChild(button);
      });
      details.appendChild(sceneList);
      fragment.appendChild(details);
    });
    container.appendChild(fragment);
  }

  function bindControls() {
    elements.desktopPrevious.addEventListener('click', goPrevious);
    elements.mobilePrevious.addEventListener('click', goPrevious);
    elements.desktopNext.addEventListener('click', goNext);
    elements.mobileNext.addEventListener('click', goNext);
    elements.mobileExplore.addEventListener('click', openMobileSheet);
    elements.closeSheet.addEventListener('click', closeMobileSheet);
    elements.sheetBackdrop.addEventListener('click', closeMobileSheet);
    elements.motionToggle.addEventListener('click', toggleMotion);

    window.addEventListener('popstate', function() {
      var requestedScene = sceneIdFromUrl();
      if (sceneById[requestedScene] && requestedScene !== currentSceneId) {
        switchScene(requestedScene, { skipHistory: true });
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && isSheetOpen()) {
        closeMobileSheet();
      }
      if (event.key === 'Tab' && isSheetOpen()) {
        keepFocusInSheet(event);
      }
    });

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        viewer.stopMovement();
      } else if (motionEnabled) {
        startMotion();
      }
    });
  }

  function switchScene(sceneId, options) {
    options = options || {};
    var destination = sceneById[sceneId];
    if (!destination || sceneId === currentSceneId) {
      return;
    }

    showLoading();
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
    destination.view.setParameters(destination.data.initialViewParameters);
    destination.scene.switchTo({ transitionDuration: options.immediate ? 0 : 650 });
    currentSceneId = sceneId;
    updateInterface();

    if (!options.skipHistory) {
      updateUrl(sceneId, Boolean(options.replaceHistory));
    }
    if (motionEnabled) {
      startMotion();
    }

    window.setTimeout(hideLoading, options.immediate ? 250 : 700);
  }

  function updateInterface() {
    var group = groupBySceneId[currentSceneId];
    elements.currentGroup.textContent = group.label;
    elements.currentScene.textContent = sceneName(currentSceneId);
    document.title = sceneName(currentSceneId) + ' · ' + activeVariant.title + ' · Hotel Italia Palace';

    document.querySelectorAll('[data-scene-id]').forEach(function(button) {
      var active = button.dataset.sceneId === currentSceneId;
      button.classList.toggle('is-current', active);
      if (active) {
        button.setAttribute('aria-current', 'page');
      } else {
        button.removeAttribute('aria-current');
      }
    });

    document.querySelectorAll('[data-group-id]').forEach(function(details) {
      if (details.dataset.groupId === group.id) {
        details.open = true;
      }
    });

    var currentIndex = route.indexOf(currentSceneId);
    var previousId = route[(currentIndex - 1 + route.length) % route.length];
    var nextId = route[(currentIndex + 1) % route.length];
    renderRouteButton(elements.desktopPrevious, previousId, 'previous');
    renderRouteButton(elements.mobilePrevious, previousId, 'previous');
    renderRouteButton(elements.desktopNext, nextId, 'next');
    renderRouteButton(elements.mobileNext, nextId, 'next');
  }

  function renderRouteButton(button, destinationId, direction) {
    var destinationGroup = groupBySceneId[destinationId];
    var destinationName = sceneName(destinationId);
    button.replaceChildren();

    var arrow = document.createElement('span');
    arrow.className = 'route-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    // The arrow is drawn in CSS so it does not depend on an icon font.
    arrow.textContent = '';

    var copy = document.createElement('span');
    copy.className = 'route-copy';
    var group = document.createElement('small');
    group.textContent = destinationGroup.label;
    var name = document.createElement('span');
    name.textContent = destinationName;
    copy.appendChild(group);
    copy.appendChild(name);

    if (direction === 'previous') {
      button.appendChild(arrow);
      button.appendChild(copy);
    } else {
      button.appendChild(copy);
      button.appendChild(arrow);
    }
    button.dataset.destination = destinationId;
    button.setAttribute(
      'aria-label',
      (direction === 'previous' ? 'Previous: ' : 'Next: ') +
      destinationName + ', ' + destinationGroup.label
    );
    button.title = destinationGroup.label + ' · ' + destinationName;
  }

  function goPrevious(event) {
    switchScene(event.currentTarget.dataset.destination);
  }

  function goNext(event) {
    switchScene(event.currentTarget.dataset.destination);
  }

  function openMobileSheet() {
    window.clearTimeout(sheetCloseTimer);
    elements.mobileSheet.hidden = false;
    elements.sheetBackdrop.hidden = false;
    document.body.classList.add('sheet-open');
    elements.mobileExplore.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(function() {
      elements.mobileSheet.classList.add('is-open');
      elements.sheetBackdrop.classList.add('is-open');
      var current = elements.mobileNavigation.querySelector('.is-current');
      (current || elements.closeSheet).focus();
    });
  }

  function closeMobileSheet() {
    if (!isSheetOpen()) {
      return;
    }
    elements.mobileSheet.classList.remove('is-open');
    elements.sheetBackdrop.classList.remove('is-open');
    document.body.classList.remove('sheet-open');
    elements.mobileExplore.setAttribute('aria-expanded', 'false');
    sheetCloseTimer = window.setTimeout(function() {
      elements.mobileSheet.hidden = true;
      elements.sheetBackdrop.hidden = true;
      elements.mobileExplore.focus();
    }, prefersReducedMotion() ? 0 : 280);
  }

  function isSheetOpen() {
    return elements.mobileSheet.classList.contains('is-open');
  }

  function keepFocusInSheet(event) {
    var focusable = Array.prototype.slice.call(
      elements.mobileSheet.querySelectorAll('button:not([disabled]), summary, [href], [tabindex]:not([tabindex="-1"])')
    );
    if (!focusable.length) {
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function toggleMotion() {
    motionEnabled = !motionEnabled;
    elements.motionToggle.setAttribute('aria-pressed', String(motionEnabled));
    elements.motionLabel.textContent = motionEnabled ?
      'Stop automatic rotation' : 'Start automatic rotation';
    elements.motionToggle.classList.toggle('is-active', motionEnabled);
    if (motionEnabled) {
      startMotion();
    } else {
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
    }
  }

  function startMotion() {
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(4000, autorotate);
  }

  function createPanoramaLink(hotspot) {
    var destination = sceneDataById[hotspot.target];
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'hotspot link-hotspot custom-hotspot';
    button.setAttribute('aria-label', 'Go to ' + sceneName(hotspot.target));

    var marker = document.createElement('span');
    marker.className = 'custom-hotspot-marker';
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = '↑';
    marker.style.transform = 'rotate(' + (hotspot.rotation || 0) + 'rad)';
    var label = document.createElement('span');
    label.className = 'custom-hotspot-label';
    label.textContent = destination ? sceneName(hotspot.target) : 'Continue tour';
    button.appendChild(marker);
    button.appendChild(label);
    button.addEventListener('click', function() {
      switchScene(hotspot.target);
    });
    stopEventPropagation(button);
    return button;
  }

  function stopEventPropagation(element) {
    [
      'pointerdown', 'pointermove', 'pointerup',
      'touchstart', 'touchmove', 'touchend', 'touchcancel',
      'wheel', 'mousewheel'
    ].forEach(function(eventName) {
      element.addEventListener(eventName, function(event) {
        event.stopPropagation();
      });
    });
  }

  function sceneName(sceneId) {
    return config.names[sceneId] || sceneDataById[sceneId].name;
  }

  function sceneIdFromUrl() {
    var match = window.location.hash.match(/^#scene=(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function updateUrl(sceneId, replace) {
    var url = window.location.pathname + window.location.search + '#scene=' + encodeURIComponent(sceneId);
    var state = { scene: sceneId };
    if (replace) {
      window.history.replaceState(state, '', url);
    } else {
      window.history.pushState(state, '', url);
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function showLoading() {
    elements.loadingStatus.classList.remove('is-hidden');
  }

  function hideLoading() {
    elements.loadingStatus.classList.add('is-hidden');
  }
})();

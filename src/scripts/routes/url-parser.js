function extractPathnameSegments(path) {
  const splitUrl = path.replace(/^\/+|\/+$/g, '').split('/'); // hapus slash di awal/akhir
  return {
    resource: splitUrl[0] || null,
    id: splitUrl[1] || null,
  };
}

function constructRouteFromSegments(segments) {
  let pathname = '';

  if (segments.resource) {
    pathname += `/${segments.resource}`;
  }

  if (segments.id) {
    pathname += '/:id';
  }

  return pathname || '/';
}

export function getActivePathname() {
  return location.hash.replace(/^#/, '') || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const segments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(segments);
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

export function getRoute(pathname) {
  const segments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(segments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}
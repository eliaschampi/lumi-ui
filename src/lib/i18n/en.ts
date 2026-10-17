/**
 * English copy (default), one export per key so bundles keep only the
 * strings their components use. `lumiEn` in `./index` collects them all.
 */

export const close = 'Close';
export const cancel = 'Cancel';
export const apply = 'Apply';
export const clear = 'Clear';
export const search = 'Search…';
export const loading = 'Loading…';
export const noData = 'No data available';
export const noResults = 'No results';
export const options = 'Options';

export const alertDismiss = 'Dismiss alert';
export const notificationDismiss = 'Dismiss notification';
export const notifications = 'Notifications';
export const chipRemove = 'Remove';
export const dialog = 'Dialog';
export const dialogClose = 'Close dialog';
export const emptyTitle = 'Nothing here yet';
export const imageError = 'Image unavailable';
export const progress = 'Progress';

export const errorBadRequestKicker = 'Invalid request';
export const errorBadRequestTitle = 'Something is off with this request';
export const errorBadRequestDescription =
	'Check the information you sent or go back and try again with valid data.';
export const errorNotFoundKicker = 'Page not found';
export const errorNotFoundTitle = 'This page does not exist or has moved';
export const errorNotFoundDescription =
	'Return to the home page and continue from a section that is available to you.';
export const errorServerKicker = 'Server error';
export const errorServerTitle = 'We could not complete this operation';
export const errorServerDescription =
	'Something unexpected happened. Reload the page or go back home.';
export const errorBack = 'Go back';
export const errorHome = 'Go home';
export const errorRetry = 'Try again';

export const avatar = 'Avatar';
export const avatarGroup = (count: number) =>
	count === 1 ? '1 member' : `${count} members`;
export const unnamed = 'Unnamed';

export const numberDecrease = 'Decrease';
export const numberIncrease = 'Increase';
export const selectPlaceholder = 'Select…';
export const selectEmpty = 'No options available';
export const selectLoading = 'Loading options…';
export const selectClear = 'Clear selection';
export const selectOpen = 'Open options';
export const selectClose = 'Close options';
export const slider = 'Value';
export const dateFrom = 'From';
export const dateTo = 'To';
export const fileUploadTitle = 'Upload your files';
export const fileUploadHint = 'Drag files here or click to browse';
export const fileUploadAddMore = 'Add more files';
export const fileUploadList = 'Selected files';
export const fileUploadRemove = (name: string) => `Remove ${name}`;
export const fileUploadMaxSize = (size: string) => `Maximum size: ${size}`;
export const fileUploadType = (name: string) =>
	`${name}: this file type is not allowed`;
export const selectMinQuery = (count: number) =>
	`Type at least ${count} ${count === 1 ? 'character' : 'characters'}`;
export const selectSearchError = 'Search failed. Try again.';

export const tableSelectAll = 'Select all rows';
export const tableSelectRow = (row: number) => `Select row ${row}`;
export const pagination = 'Pagination';
export const paginationPrevious = 'Previous';
export const paginationNext = 'Next';
export const paginationPage = (page: number) => `Page ${page}`;
export const paginationRange = (from: number, to: number, total: number) =>
	`Showing ${from}–${to} of ${total}`;
export const paginationStatus = (page: number, pages: number) =>
	`Page ${page} of ${pages}`;
export const chart = 'Chart';
export const chartBar = 'Bar chart';
export const chartDonut = 'Donut chart';
export const chartSeries = 'Chart series';
export const chartEmpty = 'Not enough data to show this chart.';

export const tabs = 'Tabs';
export const contextMenu = 'Context menu';
export const sidebar = 'Sidebar';
export const sidebarToggle = 'Toggle sidebar';
export const pageActions = 'Page actions';
export const pageSidebarTitle = 'Filters';
export const pageSidebarClose = 'Close side panel';

export const messages = 'Messages';
export const messagesLatest = 'Jump to latest';
export const messagesLoadingEarlier = 'Loading earlier messages…';

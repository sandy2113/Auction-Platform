(window as any).global = window;

/***************************************************************************************************
 * Load `$localize` for Angular's i18n support.
 */
import '@angular/localize/init';

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// Zone JS is required by Angular itself
import 'zone.js'; // Included with Angular CLI.

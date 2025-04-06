import { loadHeaderFooter, gameById } from "./utilities";
import { setDynamicPageTitle } from "./pageTitle.js";
// load content
await loadHeaderFooter();


await gameById();
await setDynamicPageTitle();
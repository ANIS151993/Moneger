import { loadClientProjectId, loadServiceAccountSummary, assertProjectAlignment } from "./_admin-helpers.mjs";

const serviceAccount = loadServiceAccountSummary();
const clientProject = loadClientProjectId();

console.log("Firebase admin config summary");
console.log(`- Service account file: ${serviceAccount.path}`);
console.log(`- Service account project: ${serviceAccount.projectId}`);
console.log(`- Service account client: ${serviceAccount.clientEmail}`);
console.log(`- App client project (${clientProject.source}): ${clientProject.projectId || "(missing)"}`);

assertProjectAlignment(serviceAccount.projectId, clientProject.projectId);

console.log("Project alignment check passed.");

import Link from "next/link";
import Image from "next/image";

const ActivityLink = ({ href, imageSrc, altText, text }) => (
  <Link
    href={href}
    className="d-flex flex-column align-items-center justify-content-center text-center text-decoration-none text-dark"
  >
    <div className="mb-4 img-fluid activity-link-container">
      <Image src={imageSrc} alt={altText} width={100} height={100} />
    </div>
    <h5>{text}</h5>
  </Link>
);

export default function AuditAdminPage() {
  return (
    <main className="container-fluid">
      <div className="row bg-white custom_row rounded-corner">
        <div className="col-md-12 p-4 ">
          <h5 className="fw-strong">Audit Admin </h5>
          <hr></hr>
          <div className="d-flex justify-content-between align-items-center m-5">
            <div className="card p-4">
              <ActivityLink
                href="/audit-management/audit-admin/audit-checkpoint-library"
                imageSrc="/iconsImage/checkpointLibrary2.jpg"
                altText="Audit CheckPoint Library"
                text="CheckPoint Library"
              />
            </div>
            <div className="card p-4">
              <ActivityLink
                href="/audit-management/audit-admin/assign-audit-checkpoint"
                imageSrc="/iconsImage/assignAudit.jpg"
                altText="Assign Audit CheckPoint"
                text="Assign CheckPoint"
              />
            </div>
            <div className="card p-4">
              <ActivityLink
                href="/audit-management/audit-admin/activate-audit"
                imageSrc="/iconsImage/activateAudit.jpg"
                altText="Activate Audit"
                text="Activate Audit"
              />
            </div>
            <div className="card p-4">
              <ActivityLink
                href="/audit-management/audit-admin/change-auditee"
                imageSrc="/iconsImage/changeAuditee.jpg"
                altText="Change Auditee "
                text="Change Auditee"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

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

export default function Page() {
  return (
    <main className="container-fluid">
      <div className="row custom_row bg-white rounded-corner">
        <div className="col-md-12 p-4 ">
          <h5 className="fw-strong px-2">Activity Mapping</h5>
          <hr></hr>
          <div className="d-flex justify-content-between align-items-center m-5">
            <div className="card p-4">
              <ActivityLink
                href="/activity-mapping/import-activity"
                imageSrc="/iconsImage/ImportActivity.jpg"
                altText="Import Activity"
                text="Import Activity"
              />
            </div>
            <div className="card p-4">
              <ActivityLink
                href="/activity-mapping/assign-activity"
                imageSrc="/iconsImage/AssignActivity2.jpg"
                altText="Assign Activity"
                text="Assign Activity"
              />
            </div>
            <div className="card p-4">
              <ActivityLink
                href="/activity-mapping/activity-configuration"
                imageSrc="/iconsImage/ActivityConfig.jpg"
                altText="Activity Configuration"
                text="Configuration"
              />
            </div>
            <div className="card p-4">
              <ActivityLink
                href="/activity-mapping/activate-activity"
                imageSrc="/iconsImage/ActivateActivity.jpg"
                altText="Activate Activity "
                text="Activate Activity "
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

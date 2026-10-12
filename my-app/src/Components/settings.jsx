import Icon from "./icon";
import Button from "./btn";




export default function Settings({ onBack, onSignOut, user }) {
    return (
        <main className="profile-page">
            <button
                type="button"
                className="profile-back-button"
                onClick={onBack}
            >
                <Icon name="arrow-left" size={18} />
                Back
            </button>
            <header className="profile-header">
                <p className="card-eyebrow">Your account</p>
                <h1>Settings</h1>

            </header>

            <section
                className="profile-data-card p-3"
                aria-label="Inquiry data"
            >
                <div className="mb-5">
                    <h2>
                        Account:
                    </h2>
                    <p> Signed in as {user?.email || "Guest"}</p>
                    <Button onClick={onSignOut} className="col-6" text="Sign Out"></Button>
                </div>
                <h2>
                    <Button
                        text="Delete Account"
                        bg="#1c1c1c"
                        color="#ef4444"
                        border="1px solid #4a2626"
                    />
                </h2>
            </section>
        </main>
    );
}

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
                className="profile-data-card settings-card"
                aria-label="Account settings"
            >
                <div className="settings-section">
                    <div className="settings-section__copy">
                        <h2>Account</h2>
                        <p>Signed in as {user?.email || "Guest"}</p>
                    </div>
                    {user && (
                        <Button
                            onClick={onSignOut}
                            className="settings-action"
                            text="Sign Out"
                        />
                    )}
                </div>

                <div className="settings-section settings-section--danger">
                    <div className="settings-section__copy">
                        <h2>Danger zone</h2>
                        <p>Delete your account and its saved workout data.</p>
                    </div>
                    <Button
                        text="Delete Account"
                        bg="#1c1c1c"
                        color="#ef4444"
                        border="1px solid #4a2626"
                        className="settings-action"
                    />
                </div>
            </section>
        </main>
    );
}

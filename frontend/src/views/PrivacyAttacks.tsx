import React from "react";
import styles from "./PrivacyAttacks.module.css";

export default function PrivacyAttacks() {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Privacy Attacks</h3>
      <div className={styles.card} id={styles.height50}>
        <h5 className={styles.subtitle}>Model Inversion Attack</h5>
      </div>
      <div className={styles.card} id={styles.height45}>
        <h5 className={styles.subtitle}>Membership Inference Attack</h5>
      </div>
    </section>
  );
}

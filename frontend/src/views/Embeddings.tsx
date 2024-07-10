import React from "react";
import styles from "./Embeddings.module.css";

export default function Settings() {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Embeddings</h3>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <p className={styles.subtitle}>Original Model</p>
          <img
            className={styles.img}
            src="/model1.png"
            alt="Embedding model img1"
          />
        </div>
        <div style={{ width: "10px" }} />
        <div className={styles.card}>
          <p className={styles.subtitle}>Unlearned Model</p>
          <img
            className={styles.img}
            src="/model2.png"
            alt="Embedding model img2"
          />
        </div>
      </div>
    </section>
  );
}

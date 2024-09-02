import styles from "./Privacies.module.css";

import Title from "../components/Title";
import ContentBox from "../components/ContentBox";

interface Props {
  height: number;
}

export default function Privacies({ height }: Props) {
  return (
    <section className={styles["privacy-attacks"]}>
      <Title title="Privacies" />
      <ContentBox height={height}>
        <div className={styles.wrapper}></div>
      </ContentBox>
    </section>
  );
}
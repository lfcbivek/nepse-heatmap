import AppLayout from "./AppLayout";
import Heading from "@/app/components/Heading";
import HeatMapContainer from "@/app/components/HeatMapContainer";
import SwataLogo from "./components/SwataLogo";
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.mainPage}>
      <main className="nepse-heatmap-container">
        <AppLayout>
          <Heading />
          <hr style={{ border: "none", borderTop: "1px solid rgb(235, 235, 235)" }} />
          <HeatMapContainer />
          <SwataLogo />
        </AppLayout>
      </main>
    </div>
  );
}

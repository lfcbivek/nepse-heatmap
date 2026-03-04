"use client";
import Image from "next/image";
import styles from "./SwataLogo.module.scss";
export default function SwataLogo() {
    return (
        <div className={styles.swataLogoContainer}>
            <Image src="/swata.svg" alt="Swata Logo" width={100} height={100} onClick={() => window.open("https://www.swata-tech.com", "_blank")} />
        </div>
    );
}
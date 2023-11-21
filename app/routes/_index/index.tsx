import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { countDevices } from "~/utils/db/models/devices";
import { countHeartbeats } from "~/utils/db/models/heartbeats";
import styles from "./index.module.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Heartbeat" },
    { name: "description", content: "An API collecting heartbeats." },
  ];
};

export const loader: LoaderFunction = async ({ context }) => {
  return Promise.all([
    countDevices(context as unknown as ContextEnv),
    countHeartbeats(context as unknown as ContextEnv),
  ]);
};

export default function Index() {
  const [devicesCount, heartbeatsCount] = useLoaderData<[number, number]>();

  return (
    <main className={styles.main}>
      <h1 className="sr-only">Heartbeat API</h1>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 72 72"
      >
        <title>A heart icon</title>
        <path
          className={styles.background}
          d="M59.5 25c0-6.904-5.596-12.5-12.5-12.5a12.497 12.497 0 0 0-11 6.56 12.497 12.497 0 0 0-11-6.56c-6.904 0-12.5 5.596-12.5 12.5 0 2.97 1.04 5.694 2.77 7.839l-.004.003L36 58.54l20.734-25.698-.004-.003A12.44 12.44 0 0 0 59.5 25z"
        />
        <path
          className={styles.frame}
          fill="none"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M59.5 25c0-6.904-5.596-12.5-12.5-12.5a12.497 12.497 0 0 0-11 6.56 12.497 12.497 0 0 0-11-6.56c-6.904 0-12.5 5.596-12.5 12.5 0 2.97 1.04 5.694 2.77 7.839l-.004.003L36 58.54l20.734-25.698-.004-.003A12.44 12.44 0 0 0 59.5 25z"
        />
      </svg>
      <section className={styles.container}>
        <h2 className="sr-only">Collected Data</h2>
        {devicesCount > 0 && (
          <section className={styles.data}>
            <h3>Devices</h3>
            <span>{devicesCount}</span>
          </section>
        )}
        {heartbeatsCount > 0 && (
          <section className={styles.data}>
            <h3>Heartbeats</h3>
            <span>{heartbeatsCount}</span>
          </section>
        )}
      </section>
    </main>
  );
}

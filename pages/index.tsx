import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { Input, Button } from "@geist-ui/react";
import { useForm } from "react-hook-form";

import { formatted } from '../lib/formatted';

import styles from "../styles/Home.module.css";

type BandwidthForm = {
  monthlyVisitors: number;
  siteUrl: string;
};

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BandwidthForm>();

  const [visitors, setVisitors] = useState<null | number>(null);
  const [pageWeight, setPageWeight] = useState('');
  const [bandwidthEstimate, setBandwidthEstimate] = useState<null | number>(
    null
  );

  const onSubmit = async ({ siteUrl, monthlyVisitors }: BandwidthForm) => {
    setVisitors(monthlyVisitors);
    const data = await (await fetch(`/api/pageweight/?url=${siteUrl}`)).json();
    setPageWeight(data);
    setBandwidthEstimate(Number(data) * monthlyVisitors);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Bandwidth Estimator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Monthly bandwidth estimator</h1>
      <h4 className={styles.subtitle}>(for marketing sites, not serverless functions)</h4>
        <form
          className={styles.bandwidthForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            className={styles.input}
            {...register("monthlyVisitors", {
              required: true,
              pattern: /^[1-9]\d*$/,
            })}
            placeholder="Unique monthly visitors"
            type={errors.monthlyVisitors ? 'error' : 'default'}
          />
          <Input
            className={styles.input}
            {...register("siteUrl", {
              required: true,
              pattern:
                /^(?:(ftp|http|https)?:\/\/)?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}$/i,
            })}
            placeholder="https://yourwebsite.co"
            type={errors.siteUrl ? 'error' : 'default'}
          />
          <Button
            htmlType="submit"
            loading={isSubmitting}
            type="success"
            className={styles.button}
          >
            Submit
          </Button>
        </form>
        {bandwidthEstimate &&
          <h3 className={styles.estimate}>Estimated bandwidth usage: {formatted(bandwidthEstimate)}.</h3>
        }
      </main>
    </div>
  );
};

export default Home;

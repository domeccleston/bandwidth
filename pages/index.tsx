import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { Input, Button } from "@geist-ui/react";
import { useForm } from "react-hook-form";

import { formatted } from "../lib/formatted";

import styles from "../styles/Home.module.css";

type BandwidthForm = {
  monthlyVisitors: number;
  siteUrl: string;
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Deprecated – for bandwidth estimations please contact @dom eccleston on Slack</h1>
    </div>
  );
};

export default Home;

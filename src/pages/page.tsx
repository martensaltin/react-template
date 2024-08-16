import React from "react";

import { useTranslation } from "../context/i18n";

const Page: React.FC = () => {
  const { setLang, translate } = useTranslation();

  return (
    <div>
      {translate("welcome")}
      <button onClick={() => setLang("sv")}>{translate("swedish")}</button>
      <button onClick={() => setLang("en")}>{translate("english")}</button>
    </div>
  );
};

export default Page;

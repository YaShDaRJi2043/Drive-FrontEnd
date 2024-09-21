import React, { createContext, useState } from "react";

export const dataContext = createContext();

const ContextProvider = ({ children }) => {
  const [dataCalled, setDataCalled] = useState(true);

  return (
    <>
      <dataContext.Provider value={{ dataCalled, setDataCalled }}>
        {children}
      </dataContext.Provider>
    </>
  );
};

export default ContextProvider;

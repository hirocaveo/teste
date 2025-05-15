declare global {
    interface Window {
      ZaigWebFaceRecon: {
        WebFaceRecon: new (
          element: HTMLElement,
          key: string
        ) => {
          setThemeConfiguration: (config: {
            buttonColor: string;
            fontColor: string;
            backgroundColor: string;
          }) => any;
          setSandboxEnvironment: () => any;
          setLogLevel: (level: string) => any;
          setSessionId: (id: string) => any;
          build: () => {
            initialize: () => Promise<void>;
            open: () => Promise<string>;
          };
        };
      };
    }
  }
  
export {};
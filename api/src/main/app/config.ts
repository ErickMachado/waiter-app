import config from 'config';

interface Settings {
  application: {
    port: number;
    uploadsFolderName: string;
  };
}

function getConfig(): Settings {
  return {
    application: {
      port: config.get('application.port'),
      uploadsFolderName: config.get('application.uploads_folder_name'),
    },
  };
}

export const settings = getConfig();

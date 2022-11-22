import config from 'config';

interface Settings {
  application: {
    port: number;
    uploadsFolderName: string;
  };
  database: {
    database: string;
    host: string;
    port: number;
  };
}

function getConfig(): Settings {
  return {
    application: {
      port: config.get('application.port'),
      uploadsFolderName: config.get('application.uploads_folder_name'),
    },
    database: {
      database: config.get('database.database'),
      host: config.get('database.host'),
      port: config.get('database.port'),
    },
  };
}

export const settings = getConfig();
export const getConnectionString = () =>
  `mongodb://${settings.database.host}:${settings.database.port}/${settings.database.database}`;

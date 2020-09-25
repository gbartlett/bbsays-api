interface BaseLogMetadata {
  [key: string]: any;
}
interface AtLeastUserId extends BaseLogMetadata {
  userId?: string | number;
}

interface AtLeastEmail extends BaseLogMetadata {
  email?: string;
}

interface AtLeastIsTopLevel extends BaseLogMetadata {
  isTopLevel?: boolean;
}

type LogMetadata = AtLeastUserId | AtLeastIsTopLevel | AtLeastEmail;

type ErrorMetadata = LogMetadata & { error: Error };

const info = (msg: string, properties: LogMetadata) => {
  console.log(msg, JSON.stringify(properties, null, 2));
};

const error = (msg: string, properties: ErrorMetadata) => {
  console.error(msg, JSON.stringify(properties, null, 2));
};

export default {
  info,
  error,
};

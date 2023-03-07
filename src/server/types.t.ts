export interface Err {
    log: string;
    status: number;
    message: {
        err: string,
    };
};

export interface Db {
    query: () => {};
};
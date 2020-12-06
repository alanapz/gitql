
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum TreeItemType {
    BLOB = "BLOB",
    SUBTREE = "SUBTREE"
}

export interface IQuery {
    getCommit(id: string): Commit | Promise<Commit>;
    getTree(id: string): Tree | Promise<Tree>;
    getBlob(id: string): Blob | Promise<Blob>;
}

export interface Ref {
    id: string;
    parent?: Commit;
    author: string;
    committer: string;
    tree: Tree;
}

export interface Commit {
    id: string;
    parents: Commit[];
    author: string;
    committer: string;
    tree: Tree;
}

export interface Tree {
    id: string;
    items: TreeItem[];
    getItem?: TreeItem;
    resolveBlob?: Blob;
}

export interface TreeItem {
    name: string;
    tree: Tree;
    mode: string;
    type: TreeItemType;
    blob?: Blob;
    subtree?: Tree;
}

export interface Blob {
    id: string;
    size: number;
    value: string;
}

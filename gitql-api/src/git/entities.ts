export enum GitObjectType {
    Blob = "blob",
    Tree = "tree",
    Commit = "commit",
    Tag = "tag"
}

export enum GitTreeItemType {
    Blob = "blob",
    Subtree = "tree"
}

export interface GitObject {
    id: string;
    type: GitObjectType;
    size: number;
}

export interface GitTreeItem {
    id: string;
    type: GitTreeItemType;
    name: string;
    mode: string;
}

export interface GitCommit {
    id: string;
    treeId: string;
    author: string;
    committer: string;
    message: string;
}
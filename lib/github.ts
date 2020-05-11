import { graphql } from '@octokit/graphql'
import { Octokit } from '@octokit/rest'

type GraphQl = typeof graphql

/**
 * A git reference, either a branch or a tag.
 */
interface Ref {
  name: string
  repository: {
    id: string
  }
  target: {
    oid: string
  }
}

/**
 * Response returned by the `createBranch` mutation.
 */
interface CreateBranchResponse {
  createRef: {
    ref: Ref
  }
}

/**
 * Response returned by the `getDefaultBranch` query.
 */
interface GetDefaultBranchResponse {
  repository: {
    defaultBranchRef: Ref
  }
}

const createBranchMutation = `
mutation createBranch($name: String!, $oid: GitObjectID!, $repoId: ID!) {
  createRef(input: { clientMutationId: "rename-default-branch", name: $name, oid: $oid, repositoryId: $repoId }) {
    ref {
      name
      repository {
        id
      }
      target {
        oid
      }
    }
  }
}
`

const getDefaultBranchQuery = `
query getDefaultBranch($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      name
      repository {
        id
      }
      target {
        oid
      }
    }
  }
}
`

var authToken: string = ''

/**
 * Create a branch on a GitHub repository.
 *
 * Returns a reference to the newly created branch.
 */
export async function createBranch(name: string, repoId: string, oid: string) {
  const octokit = graphql.defaults({
    headers: {
      authorization: `token ${authToken}`,
    },
  })

  const response = (await octokit(createBranchMutation, {
    name: `refs/heads/${name}`,
    oid,
    repoId,
  })) as CreateBranchResponse

  return response.createRef.ref
}

/**
 * Get the default branch for a repository.
 *
 * Returns a reference to the repository's default branch.
 */
export async function getDefaultBranch(owner: string, name: string) {
  const octokit = graphql.defaults({
    headers: {
      authorization: `token ${authToken}`,
    },
  })

  const response = (await octokit(getDefaultBranchQuery, {
    owner,
    name,
  })) as GetDefaultBranchResponse

  return response.repository.defaultBranchRef as Ref
}

/**
 * Set the token to use for authorization against the GraphQL API.
 *
 * Returns the authorized `graphql` object to use for future requests.
 */
export function setToken(token: string) {
  authToken = token
}

export async function updateDefaultBranch(
  owner: string,
  name: string,
  branch: string
) {
  const octokit = new Octokit({ auth: authToken })

  return await octokit.repos.update({ owner, repo: name, default_branch: branch })
}

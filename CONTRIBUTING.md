# Contributing

These guidelines are to support the submission of high quality code and to speed up the time required to complete the code review.

## Process

1. Fork maxyermayank/[your project]
1. `clone` your fork `username/[your project]` to you development machine
1. `git checkout develop`
1. Create a branch (`git checkout -b ABC-123-my_issue`)
1. Run unit tests while you work
1. Write code to implement story or bug fix, and accompanying unit tests
1. Write integration tests
1. Run unit tests and integration tests before committing
1. Commit your changes (`git commit -am "AMC-123 Added my_issue"`)
1. Push to the branch (`git push origin my_issue`)
1. Open a Pull Request

## Pull Requests

### Pull Request Titles

Titles should start with the JIRA issue number and summarize what the pull request does

#### Example Pull Request Title

```
ABC-123 - Create contribution guidelines
```

Put "[DO NOT MERGE]" in the title unless you believe the PR is ready to merge.

#### Example "[DO NOT MERGE]" Pull Request Title

```
"[DO NOT MERGE]" ABC-123 - Create contribution guidelines
```

### Pull Request Template

To ensure quality of submissions and to speed up PR review, please paste the following PR Template and fill in the blanks:

```

# Description

Files changed: [How many files?]
Based on: [which branch, ex. develop]
Release Targeted: [which release, ex. initial]
Branch Targeted: [which branch, ex. develop]

# Dependencies and Related PRs
Depends on PRs: [#XX, #YY]
Dependant PRs: [#ZZ]
Related PRs: [#AA]

# Tasks

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] [How many?] tests added
- [ ] No new tests required [Reason?]

# Completed Reviews

- [ ] @reviewer1
- [ ] @reviewer2
```

## Notes:

* Report how many files you intended to change. Make sure this number matches the number actually included in the PR.
* Run unit tests immediately prior to your commit and confirm they are all passing by checking "Unit tests pass"
* Run integration tests immediately prior to your commit (against your local code) and confirm they are all passing by checking "Integration tests pass"
* If tests were added, check "tests added", note how many test cases you added
* If no new tests were required, check "No new tests required" and provide a reason (Ex. Documentation Only)

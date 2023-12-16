# Collaborative Brainstorming Platform

## Video Example
https://github.com/cybertechy/Collabrain/assets/58950397/2444681b-b487-482a-a84b-7b8530efef6c



### Steps
1. Create a branch for implementing a new feature
2. Publish your branch to github
3. Code, commit and push your changes
4. Create a pull request
5. Delete branch after approval
6. Sync your local main branch with github

### Git Commands

#### Create a branch and switch to it
```bash
git branch <branch-name>
git checkout <branch-name>
```

or a shorter version
> -b flag creates a new branch during checkout

```bash
git checkout -b <branch-name>
```

#### Publish your branch to github
```bash
git push -u origin <branch-name>
```

#### Commit and push your changes
> Don't need to specify branch name because you are already on that branch
```bash
git add .
git commit -m "commit message"
git push
```

#### Create a pull request
> Reccomended to create a pull request with vscode for simplicity
```bash
git request-pull <start> <url> [<end>]
```

#### Delete branch locally after approval
```bash
git branch -D <branch-name>
```

#### Delete branch on github remote after approval
```bash
git push <remote> -d <branch-name>
```

#### Sync your local main branch with github
```bash
git pull
```

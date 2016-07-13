import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import currentRepoTab from 'travis/tests/pages/repo-tabs/current';
import buildTabs from 'travis/tests/pages/build-tabs';

moduleForAcceptance('Acceptance | builds/current tab', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('renders most recent repository without builds', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});

  currentRepoTab
    .visit();

  andThen(function() {
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
    assert.equal(currentRepoTab.showsNoBuildsMessaging, 'No builds for this repository', 'Current tab shows no builds message');
  });
});

test('renders most recent repository and most recent build when builds present', function(assert) {

  // so I guess we're assuming a single job and this is exacly what we need to test the config

  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  let branch = server.create('branch', {});
  let build = server.create('build', {number: '5', repository: repo, state: 'passed'});
  let commit = server.create('commit', {author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true});
  let job = server.create('job', {number: '1234.1', repository: repo, state: 'passed', build_id: build.id, buildId: build.id, commit_id: commit.id, config: { language: 'Hello' }});
  let log = server.create('log', { id: job.id });

  build.commit = commit;
  commit.build = build;

  build.save();
  commit.save();

  currentRepoTab
    .visit();

  andThen(function() {
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
    assert.ok(currentRepoTab.showsCurrentBuild, 'Shows current build');

    window.buildTabs = buildTabs;
    console.log(currentURL());
    debugger
    assert.ok(buildTabs.logTab.isShowing, 'Displays the log');
    assert.ok(buildTabs.configTab.isHidden, 'Job config is hidden');
  });

  buildTabs.configTab.click();

  andThen(function() {
    assert.equal(buildTabs.configTab.contents, '[{\"language\":\"Hello\"}]');

    assert.ok(buildTabs.configTab.isShowing, 'Displays the job config');
    assert.ok(buildTabs.logTab.isHidden, 'Job log is hidden');
  });
  
  
    
});



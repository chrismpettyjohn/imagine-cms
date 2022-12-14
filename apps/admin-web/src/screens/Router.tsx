import React from 'react';
import { Switch, Route } from 'wouter';
import {LogoutScreen} from './logout-screen/LogoutScreen';
import {ChatlogListScreen} from './chatlog-list-screen/ChatlogListScreen';
import {LandingScreen} from './landing-screen/LandingScreen';
import {RankListScreen} from './rank-list-screen/RankListScreen';
import {BansListScreen} from './bans-list-screen/BansListScreen';
import {DashboardScreen} from './dashboard-screen/DashboardScreen';
import {UsersListScreen} from './users-list-screen/UsersListScreen';
import {NotAllowedScreen} from './not-allowed-screen/NotAllowedScreen';
import {SiteSettingsScreen} from './site-settings-screen/SiteSettingsScreen';
import {ArticlesListScreen} from './articles-list-screen/ArticlesListScreen';
import {PageNotFoundScreen} from './page-not-found-screen/PageNotFoundScreen';
import {WordFilterSettingsScreen} from './word-filter-settings-screen/WordFilterSettingsScreen';

const SITE_ROUTES: Array<{path: string, view: any, }> = [
  {
    path: '/',
    view: LandingScreen,
  },
  {
    path: '/not-allowed',
    view: NotAllowedScreen,
  },
  {
    path: '/logout',
    view: LogoutScreen,
  },
  {
    path: '/dashboard',
    view: DashboardScreen,
  },
  {
    path: '/users/list',
    view: UsersListScreen,
  },
  {
    path: '/bans/list',
    view: BansListScreen,
  },
  {
    path: '/chatlog/list',
    view: ChatlogListScreen,
  },
  {
    path: '/articles/list',
    view: ArticlesListScreen,
  },
  {
    path: '/settings/site',
    view: SiteSettingsScreen,
  },
  {
    path: '/settings/word-filter',
    view: WordFilterSettingsScreen,
  },
  {
    path: '/ranks/list',
    view: RankListScreen,
  }
]

export function Router() {
  return (
    <Switch>
      <>
        {
          SITE_ROUTES.map(route => (
            <Route key={`route_${route.path}`} path={route.path} component={route.view} />
          ))
        }
        </>
      <Route component={PageNotFoundScreen} />
    </Switch>
  )
}

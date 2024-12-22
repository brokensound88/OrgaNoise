import { lazy } from 'react';

export const Home = lazy(() => import('../pages/Home').then(module => ({
  default: module.Home
})));

export const About = lazy(() => import('../pages/About').then(module => ({
  default: module.About
})));

export const Projects = lazy(() => import('../pages/Projects').then(module => ({
  default: module.Projects
})));

export const Blog = lazy(() => import('../pages/Blog').then(module => ({
  default: module.Blog
})));

export const Contact = lazy(() => import('../pages/Contact').then(module => ({
  default: module.Contact
})));

export const NotFound = lazy(() => import('../pages/NotFound').then(module => ({
  default: module.NotFound
})));
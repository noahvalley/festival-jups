(ns backend.login.subs
  (:require
    [re-frame.core :as rf]))

(rf/reg-sub
  :jups.backend.subs/session
  (fn [db _]
    (:session db)))

(rf/reg-sub
  :jups.backend.subs/username
  (fn [db _]
    (:username db)))

(rf/reg-sub
  :jups.backend.subs/password
  (fn [db _]
    (:password db)))

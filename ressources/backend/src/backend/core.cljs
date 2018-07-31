(ns backend.core
  (:require
    [reagent.core :as reagent]
    [re-frame.core :as rf]
    [day8.re-frame.http-fx]
    [breaking-point.core :as bp]
    ["codemirror" :as cm]

    ;; -------------------------------------
    ;; load subscriptions

    [backend.subs]
    [backend.events.subs]
    [backend.files.subs]
    [backend.login.subs]
    [backend.pages.subs]

    ;; -------------------------------------
    ;; load events

    [backend.events]
    [backend.events.events]
    [backend.files.events]
    [backend.login.events]
    [backend.pages.events]

    [backend.routes :as routes]
    [backend.views :refer [main-panel]]
    [backend.config :as config]))

(js/goog.exportSymbol "CodeMirror" cm)

(defn dev-setup []
  (when config/debug?
    (enable-console-print!)
    (println "dev mode")))

(defn mount-root []
  (rf/clear-subscription-cache!)
  (reagent/render [main-panel]
                  (.getElementById js/document "app")))

(defn ^:export init []
  (routes/app-routes)
  (rf/dispatch-sync [:jups.backend.events/initialize-db])
  (rf/dispatch-sync [::bp/set-breakpoints
                     {:breakpoints [:mobile
                                    768
                                    :tablet
                                    992
                                    :small-monitor
                                    1200
                                    :large-monitor]
                      :debounce-ms 166}])
  (dev-setup)
  (mount-root))

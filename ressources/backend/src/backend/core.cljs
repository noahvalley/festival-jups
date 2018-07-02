(ns backend.core
  (:require
   [reagent.core :as reagent]
   [re-frame.core :as rf]
   [day8.re-frame.http-fx]
   [breaking-point.core :as bp]
   [backend.subs :as subs]
   [backend.events :as events]
   [backend.routes :as routes]
   [backend.views :as views]
   [backend.config :as config]))


(defn dev-setup []
  (when config/debug?
    (enable-console-print!)
    (println "dev mode")))

(defn mount-root []
  (rf/clear-subscription-cache!)
  (reagent/render [backend.views/main-panel]
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

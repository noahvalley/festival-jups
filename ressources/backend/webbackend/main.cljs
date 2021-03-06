(ns webbackend.main
  (:require
    [reagent.core :as r]
    [webbackend.events :refer [events-form]]
    [webbackend.entry :refer [login]]
    [webbackend.pages :refer [pages]]
    [webbackend.upload :refer [upload]]))

(defonce global (r/atom {:page    :events
                         :pages   {}
                         :selected-page :home
                         :session nil
                         :event   {:ausverkauft false}}))

(defn selected-view []
  (fn [global]
    [:div {:style {:display "flex" :flex-direction "column" }}
     [:p (:error @global)]
     [:div {:style {:display "flex" :flex-direction "row" :justify-content "space-between"}}
      [:button {:on-click (fn [e] (swap! global #(assoc % :page :events)))} "Events"]
      [:button {:on-click (fn [e] (swap! global #(assoc % :page :pages)))} "Pages"]
      [:button {:on-click (fn [e] (swap! global #(assoc % :page :upload)))} "Upload"]]
     (cond
       (= :events (:page @global)) [events-form global]
       (= :pages (:page @global)) [pages global]
       (= :upload (:page @global)) [upload global])]))

(defn main []
  [:div
   (cond (not (nil? (:session @global)))
         [selected-view global]
         :default [login global])])

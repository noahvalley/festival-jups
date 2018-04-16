(ns webbackend.codemirror
  (:require [cljs.core.async :refer [<!]]
            [reagent.core :as r]
            [reagent.cookies]
            [cljs-http.client :as http]))

(defn create-codemirror [dom-id]
  (js/CodeMirror
    (js/document.getElementById
      dom-id
      #js {:mode "htmlmixed"
           :smartIndent true
           :lineNumbers true})))

(defn codemirror [initial-content]
  (let [mirror (atom nil)]
    (reagent.core/create-class
      {:display-name          "codemirror"
       :reagent-render        (fn [] [:div.CodeMirror
                                      {:style {:border       "5px"
                                               :border-style "solid"
                                               :border-color "black"}}])
       :component-did-mount   #(reset! mirror (create-codemirror "CodeMirror"))})))

(defn code-mirror []
  (let [state (r/atom nil)]
    (fn []
      [:div
       [:div @state
        [:div
         {:id "mirror"
          :style {:border "5px"
                  :border-style "solid"
                  :border-color "black"}
          :on-change #(reset! state (-> % .-innerHTML))}]]
       [:button
        {:on-click #()}
        "edit"]])))

(defn randomform []
  (fn []
    [:div
     [:div
      [:div {:id "mirror" :style {:border "5px" :border-style "solid" :border-color "black"}}]]
     [:button
      {:on-click #(js/CodeMirror (js/document.getElementById "mirror" #js {:mode "htmlmixed"
                                                                           :smartIndent true
                                                                           :lineNumbers true}))}
      "edit"]]))

(defn random-form []
  [:div
   [randomform]
   [codemirror]
   [upload-field]])
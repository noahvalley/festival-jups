(ns webbackend.codemirror
  (:require [reagent.core :as r]
            [webbackend.requests :refer [update-page]]))

(defonce mirror (atom nil))

(defn get-codemirror-content []
  (.getValue @mirror))

#_(defn create-codemirror [dom-id]
    (js/CodeMirror
      (js/document.getElementById
        dom-id
        #js {:mode "htmlmixed"
             :smartIndent true
             :lineNumbers true})))

(defn codemirror-from-textarea [dom-id]
  (js/CodeMirror.fromTextArea
    (js/document.getElementById
      dom-id
      #js {:mode "htmlmixed"
           :smartIndent true
           :lineNumbers true})))

#_(defn codemirror [initial-content]
    (let [mirror (atom nil)]
      (reagent.core/create-class
        {:display-name        "codemirror"
         :reagent-render      (fn []
                                [:div.CodeMirror
                                 {:style {:border       "5px"
                                          :border-style "solid"
                                          :border-color "black"}}])
         :component-did-mount (fn []
                                (reset! mirror (create-codemirror "CodeMirror"))
                                (js/console.log @mirror)
                                (-> @mirror
                                    .getDoc
                                    (.setValue initial-content)))})))

(defn render-codemirror [initial-content]
  [:div#cmContainer
   [:input#CodeMirror
    {:type          "textarea"
     :default-value initial-content}]])

(defn mount-codemirror []
  (reset! mirror (codemirror-from-textarea "CodeMirror"))
  (.autoFormatRange @mirror
                    #js {:line 0 :ch 0}
                    #js {:line (.lineCount @mirror)}))

(defn codemirror-area [initial-content]
  (reagent.core/create-class
    {:display-name        "codemirror"
     :reagent-render      #(render-codemirror initial-content)
     :component-did-mount #(mount-codemirror)
     :component-will-update
                          (fn [_ new-args]
                            (.replaceWith
                              (js/document.getElementById "cmContainer")
                              (doto
                                (js/document.createElement "div")
                                (.setAttribute "id" "cmContainer")))
                            (reagent.core/render
                              (render-codemirror (second new-args))
                              (js/document.getElementById "cmContainer")
                              #(mount-codemirror)))
     }))

#_(defn code-mirror []
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

#_(defn randomform []
    (fn []
      [:div
       [:div
        [:div {:id "mirror" :style {:border "5px" :border-style "solid" :border-color "black"}}]]
       [:button
        {:on-click #(js/CodeMirror (js/document.getElementById "mirror" #js {:mode "htmlmixed"
                                                                             :smartIndent true
                                                                             :lineNumbers true}))}
        "edit"]]))

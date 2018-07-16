(ns backend.pages.codemirror
  (:require
    [cljsjs.codemirror]
    [cljsjs.codemirror.mode.htmlmixed]))

(defonce mirror (atom nil))

(defn get-codemirror-content []
  (.getValue @mirror))

(defn codemirror-from-textarea [dom-id]
  (js/CodeMirror.fromTextArea
    (js/document.getElementById
      dom-id
      #js {:mode "htmlmixed"
           :smartIndent true
           :lineNumbers true})))

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

(defn codemirror [initial-content]
  (reagent.core/create-class
    {:display-name        "codemirror"
     :reagent-render      #(render-codemirror initial-content)
     :component-did-mount #(mount-codemirror)
     :component-will-update (fn [_ new-args]
                            (.replaceWith
                              (js/document.getElementById "cmContainer")
                              (doto
                                (js/document.createElement "div")
                                (.setAttribute "id" "cmContainer")))
                            (reagent.core/render
                              (render-codemirror (second new-args))
                              (js/document.getElementById "cmContainer")
                              #(mount-codemirror)))}))

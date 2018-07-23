(ns backend.pages.codemirror
  (:require
    [reagent.core :as r]
    [cljsjs.codemirror]
    [cljsjs.codemirror.addon.mode.simple]
    [cljsjs.codemirror.addon.mode.overlay]
    [cljsjs.codemirror.mode.xml]
    [cljsjs.codemirror.mode.javascript]
    [cljsjs.codemirror.mode.css]
    [cljsjs.codemirror.mode.htmlmixed]))

(def cm-defaults {:lineWrapping    true
                  :mode            "htmlmixed"})

(defn coerce [s]
  (if (string? s) s (str s)))

(defn cm-editor
  ([content on-change]
   (r/create-class
     {:component-did-mount #(let [node (r/dom-node %)
                                  editor (.fromTextArea js/CodeMirror node (clj->js cm-defaults))
                                  val (coerce @content)]
                              (add-watch content nil (fn [_ _ _ source]
                                                       (let [source (coerce source)]
                                                         (if (not= source (.getValue editor))
                                                           (.setValue editor source)))))
                              (.setValue editor val)
                              (.autoFormatRange editor
                                                #js {:line 0 :ch 0}
                                                #js {:line (.lineCount editor)})
                              (.setCursor editor (.coordsChar editor (clj->js {:left 0 :top 0})))
                              (.scrollTo editor 0 0)
                              (.setSize editor "1024px" "512px")
                              (.on editor "blur" (fn [_]
                                                   (let [value (.getValue editor)]
                                                     (on-change value)))))
      :reagent-render      (fn []
                             [:textarea {:style {:width   "100%"
                                                 :height  "100%"
                                                 :display "flex"
                                                 :flex    1}}])})))

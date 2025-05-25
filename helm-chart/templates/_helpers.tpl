{{/* Define the chart name template */}}
{{- define "pena-app.name" -}}
{{ .Chart.Name }}
{{- end }}

{{/* Define the full name template (e.g., release name + chart name) */}}
{{- define "pena-app.fullname" -}}
{{ printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Define the chart version template (optional) */}}
{{- define "pena-app.chart" -}}
{{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{- define "pena-app.labels" -}}
app.kubernetes.io/name: {{ include "pena-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/version: "{{ .Chart.AppVersion }}"
app.kubernetes.io/component: {{ .Chart.Name }}
app.kubernetes.io/part-of: {{ include "pena-app.fullname" . }}
{{- end }}


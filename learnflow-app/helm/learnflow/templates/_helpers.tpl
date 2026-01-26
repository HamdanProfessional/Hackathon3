{{/*
Expand the name of the chart.
*/}}
{{- define "learnflow.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "learnflow.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "learnflow.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "learnflow.labels" -}}
helm.sh/chart: {{ include "learnflow.chart" . }}
{{ include "learnflow.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "learnflow.selectorLabels" -}}
app.kubernetes.io/name: {{ include "learnflow.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the database URL
*/}}
{{- define "learnflow.databaseUrl" -}}
{{- $template := .Values.configMap.databaseUrlTemplate }}
{{- $username := .Values.postgresql.auth.username }}
{{- $password := .Values.postgresql.auth.password }}
{{- $namespace := .Release.Namespace }}
{{- $database := .Values.postgresql.auth.database }}
{{- printf $template $username $password $namespace $database }}
{{- end }}

{{/*
Service DNS name
*/}}
{{- define "learnflow.serviceDns" -}}
{{- printf "%s.%s.svc.cluster.local" .name .Release.Namespace }}
{{- end }}

# Change history for ui-eholdings

## [9.1.0] (IN PROGRESS)

* Remove Bigtest tests. (UIEH-1390)
* Remove eslint deps that are already listed in eslint-config-stripes. (UIEH-1389)

## [9.0.2] (https://github.com/folio-org/ui-eholdings/tree/v9.0.2) (2023-11-09)

* The list of packages is no longer cut off in the modal window. (UIEH-1397)

## [9.0.1] (https://github.com/folio-org/ui-eholdings/tree/v9.0.1) (2023-11-03)

* Fix deleting and then saving custom embargo. (UIEH-1394)
* Fix Create custom title > Packages dropdown list does not display with the label. (UIEH-1382)
* Fix deleting last date range when creating a new package or editing title. (UIEH-1383)

## [9.0.0] (https://github.com/folio-org/ui-eholdings/tree/v9.0.0) (2023-10-13)

* Custom labels | Remove a dashes below labels. (UIEH-1361)
* Titles tab: Add a Packages facet. (UIEH-1350)
* Title detail record: Packages accordion - Honor Packages Facet selection(s). (UIEH-1351)
* Fix errors appearing when user switch to "User consolidation" pane. (UIEH-1362)
* Fix errors appearing when user switch to "User consolidation" pane. (UIEH-1362)
* Settings > Usage Consolidation naively parses start-month values. (UIEH-1371)
* Settings: Add `PaneCloseLink` to the `Assigned users` pane. (UIEH-1372)
* Align test babel config with stripes-webpack. (UIEH-1380, STRWEB-87)
* Devops: leverage all available CPUs in CI. (STRIPES-854)
* Leverage cookie-based authentication in all API requests. (UIEH-1345)
* Fix some dropdown field using translations as values. (UIEH-1381)
* *BREAKING* Bump `react` to `v18`. (UIEH-1384)
* Unpin moment from `v2.24`; STRIPES-678 resolved long ago. Resolves CVE-2022-24785.
* *BREAKING* bump `react-intl` to `v6.4.4`. Refs UIEH-1392.

## [8.0.3] (https://github.com/folio-org/ui-eholdings/tree/v8.0.3) (2023-03-30)

* Clear the last eholdings visited page flag after the user returns to the eholdings page form another plugin page. For proper work navigating through history. (UIEH-1366) 

## [8.0.2] (https://github.com/folio-org/ui-eholdings/tree/v8.0.2) (2023-03-23)

* Extend the "Settings (eHoldings): View settings" permission to view the "Root proxy" settings and "Knowledge Base" details. (UIEH-1355)
* Don't display the deleted custom label. (UIEH-1364)
* Revise the 'Settings (eHoldings): View settings' permission. (UIEH-1355)
* Display custom labels while editing. (UIEH-1364)
* Add `settings.eholdings.enabled` permission to view settings (UIEH-1355)
* Avoid private paths in stripes-core imports. Refs UIEH-1373.

## [8.0.1] (https://github.com/folio-org/ui-eholdings/tree/v8.0.1) (2023-03-13)

* Stop infinity loading of package titles when a user edits the package record while they are being added/removed to holdings. (UIEH-1349)
* Only display tags in the tag filter that have already been added to records. (UIEH-1357)
* Extend the "Settings (eHoldings): View settings" permission to view the "Root proxy" settings and "Knowledge Base" details. (UIEH-1355)
* Don't display the deleted custom label. (UIEH-1364)

## [8.0.0] (https://github.com/folio-org/ui-eholdings/tree/v8.0.0) (2023-02-15)

* Enable react-hooks/exhaustive-deps ESLint rule. (UIEH-1339)
* Error while accessing undefined properties in eHolidngs Titles list. (UIEH-1344)
* Difficulty returning to the eholdings page after adding a new Agreement. (UIEH-1219)
* Fixed no KB detected error incorrectly popping up on eholdings page. (UIEH-1346)
* Bump stripes to 8.0.0 for Orchid/2023-R1. (UIEH-1352)
* Upgrade react-redux to v8. (UIEH-1353)

## [7.3.2] (https://github.com/folio-org/ui-eholdings/tree/v7.3.2) (2022-11-30)

* Provider and Package detail records: Close Package and Titles accordion returns 0 titles. (UIEH-1335)
* Update Export eholdings modal to not allow user to export more than 10000 titles. (UIEH-1336)

## [7.3.1] (https://github.com/folio-org/ui-eholdings/tree/v7.3.1) (2022-11-11)

* eHoldings export: Remove "sort" from "titleSearchFilters" export config field. (UIEH-1334)
* Provider and Package detail records: Close Package and Titles accordion returns 0 titles. (UIEH-1335)

## [7.3.0] (https://github.com/folio-org/ui-eholdings/tree/v7.3.0) (2022-10-24)

* Hide filter by Tag when user doesn't have related permissions. (UIEH-1313)
* Resource (aka title+package) Detail Record: Add Alternate title(s) field. (UIEH-1328)
* Title Detail Record: Add Alternate title(s) field. (UIEH-1327)
* Export package/title modal: Include Package level token in list of fields to select. (UIEH-1316)
* Export package/title modal: Include Provider level token in list of fields to select. (UIEH-1317)

## [7.2.3] (https://github.com/folio-org/ui-eholdings/tree/v7.2.3) (2022-08-29)

* Morning Glory: Disable eholdings export. (UIEH-1324)

## [7.2.2] (https://github.com/folio-org/ui-eholdings/tree/v7.2.2) (2022-08-15)

* Package Detail: Remove the six second delay when retrieving titles in a package. (UIEH-1322)

## [7.2.1] (https://github.com/folio-org/ui-eholdings/tree/v7.2.1) (2022-07-25)

* eholdings settings > Usage Consolidation > Add missing permissions (UIEH-1169)
* Clear assigned users redux when leaving Assigned Users page. (UIEH-1315)

## [7.2.0] (https://github.com/folio-org/ui-eholdings/tree/v7.2.0) (2022-07-08)

* Add tests for useFetchExportTitlesFromPackage hook. (UIEH-1182)
* Replace or remove react-hot-loader. (UIEH-1265)
* Package Detail Record> Usage & analysis accordion > Apply pagination to Titles list. (UIEH-1259)
* Replace `babel-eslint` with `@babel/eslint-parser`. (UIEH-1275)
* Jest+RTL > Test UsageConsolidationContentResource (UIEH-1277)
* View Package Details record > Actions menu > Add a Export record option. (UIEH-1279)
* Pin @vue/compiler-sfc to fix formatjs-compile errors
* update NodeJS to v16 in GitHub Actions. (UIEH-1283)
* View Title+Package Details record > Actions menu > Add a Export record option. (UIEH-1280)
* Requirement Change - View Package Details record > Actions menu > Add a Export record option. (UIEH-1287)
* SettingsAccessStatusTypes - Use react-final-form (UIEH-1282)
* Jest+RTL > Test UsageConsolidationContentTitle(UIEH-1278)
* Export package/resources > Display Export settings modal. (UIEH-1285)
* Export eholdings package or resource details: Display toast notification  (UIEH-1284)
* Enable Agreements, Notes and Package Holdings Status export fields (UIEH-1298)
* Remove parameters from POST request for '/eholdings/kb-credentials/{kb-credentials-id}/users'. (UIEH-1237)
* Remove call to "/groups" api in settings/eholdings/assigned users. (UIEH-1236)
* Rework-kb-credentials: Remove attributes from user schema. (UIEH-1286)
* Fix error message "Knowledge base not configured" still displayed when user go to "Settings/eHoldings" link. (UIEH-1297)
* Fix Settings > eholdings > Assigned users page does not look right. (UIEH-1296)
* Fix Usage Consolidation - does not return 12 months when starting period is not January. (UIEH-1304)
* refactor away from `react-intl-safe-html`; `react-intl` `v5` subsumes it. Refs UIEH-1305.
* Fix Multiselect list overlaps the input field at "Package fields to export" section. (UIEH-1307)
* Improve error messaging when user already has been assigned to another KB. (UIEH-1303)
* eholdings settings > Usage Consolidation > Add Show/Hide toggle. (UIEH-1169)
* The errors appear when user switch to "User consolidation" pane. (UIEH-1308)

## [7.1.4] (https://github.com/folio-org/ui-eholdings/tree/v7.1.4) (2022-04-08)

* Save shortcut key does not work. (UIEH-1269)

## [7.1.3] (https://github.com/folio-org/ui-eholdings/tree/v7.1.3) (2022-04-06)

* Fix eHoldings app throws an error when 0 tags comes in the response. (UIEH-1266)

## [7.1.2] (https://github.com/folio-org/ui-eholdings/tree/v7.1.2) (2022-03-29)

* Include additional package content types in several responses. (UIEH-1240)
* Settings > eholdings > Usage Consolidation > Cannot save any updates. (UIEH-1249)

## [7.1.1] (https://github.com/folio-org/ui-eholdings/tree/v7.1.0) (2022-03-21)

* Settings > eholdings > Edit knowledge base credentials > Updating any field value generates an error message BUT the saves the update. (UIEH-1247)

## [7.1.0] (https://github.com/folio-org/ui-eholdings/tree/v7.1.0) (2022-03-03)

* Add tests for SettingsRoute component. (UIEH-1198)
* Add tests for SettingsKnowledgeBaseRoute component. (UIEH-1196)
* Add tests for TitleCreateRoute component. (UIEH-1199)
* Add tests for TitleEditRoute component. (UIEH-1200)
* Refactor '.all' permissions. (UIEH-1212)
* Add tests for TitleShowRoute component. (UIEH-1201)
* Add tests for FullTextRequestUsageTable component. (UIEH-1179)
* Add tests for SummaryTable component. (UIEH-1180)
* Add tests for ApplicationRoute component. (UIEH-1184)
* Add tests for TitlesTable component. (UIEH-1181)
* Add missing permissions to `package.json`. (UIEH-1222)
* Add tests for NoteCreate, NoteEdit, NoteView Routes. (UIEH-1185)
* Add tests for PackageCreateRoute. (UIEH-1186)
* Add tests for PackageEditRoute. (UIEH-1187)
* Lock `faker` version.
* Add tests for ProviderEditRoute. (UIEH-1186)
* Fix datepicker date format for Custom coverage dates to match current user locale when edit resource. (UIEH-1227)
* Add tests for useMultiColumnListSort. (UIEH-1183)
* Add tests for ResourceEditRoute. (UIEH-1190)
* Add tests for PackageShowRoute. (UIEH-1188)
* Add tests for ResourceShowRoute. (UIEH-1191)
* Correctly specify proptypes. (UIEH-1242)
* Unpin `final-form` and related deps. (UIEH-1241)

## [7.0.2] (https://github.com/folio-org/ui-eholdings/tree/v7.0.2) (2022-02-18)

* Fix 3 GET requests instead of 1 are made when searching Providers/Packages/Titles. (UIEH-1232)
* Missing Permissions on upgrade from Juniper to Kiwi. (UIEH-1231)
* Fix multiple requests to /resources sent when viewing Titles list on Package Show page. (UIEH-1235)

## [7.0.1] (https://github.com/folio-org/ui-eholdings/tree/v7.0.1) (2021-10-19)

* Fix store.getState is not a function error. (UIEH-1216)
* Fix Detail Record: Cannot add a tag. (UIEH-1215)
* Remove sticky list scroll on the details page. (UIEH-1214)

## [7.0.0] (https://github.com/folio-org/ui-eholdings/tree/v7.0.0) (2021-10-06)

* Fix import paths. (UIEH-1133)
* Add tests for DescriptionField, EditionField, TitleNameField, PackageSelectField components. (UIEH-1051)
* Usage Consolidation: Unable to handle gracefully handle when user attempts to view titles over 200,000. (UIEH-1136)
* Add tests for ResourceEditManagedTitle component. (UIEH-1096)
* Avoid .all permissions. (UIEH-1135)
* Add tests for CoverageDateList component. (UIEH-1056)
* Fix View/Edit Managed title - Custom Package Record: Custom Package URL field does not display. (UIEH-1140)
* Fix The Eholdings app is NOT displayed in the app bar when the "eHoldings: Can view Usage..." permission is applied. (UIEH-1142)
* Add tests for ResourceEditCustomTitle component. (UIEH-1095)
* Add tests for TitleShow component. (UIEH-1098)
* Add tests for AgreementsList component. (UIEH-1055)
* Choose custom package - batch load packages. (UIEH-962)
* Add tests for PackageShow component. (UIEH-1094)
* Fix bug with root proxy selection. (UIEH-1143)
* Add tests for SelectionStatus component. (UIEH-1059)
* Add tests for ProviderListItem component. (UIEH-1060)
* Refactoring of NavigationModal. (UIEH-1057)
* Add tests for CoverageStatementFields and VisibilityField components. (UIEH-1062)
* Add tests for SearchPaneset. (UIEH-1063)
* Add tests for EHoldings. (UIEH-1153)
* Add tests for ContributorField component. (UIEH-1066)
* Change Provider information display on View Provider details record. (UIEH-1156)
* Change Package information display on View Package details record. (UIEH-1157)
* Add tests for IdentifiersFields component. (UIEH-1067)
* Add tests for TitleCreate component. (UIEH-1068)
* Change Resource Settings Display on Edit Resource details record. (UIEH-1161)
* Support erm 5.0 interface. (UIEH-1154)
* Change Package Settings display on Edit Package details record. (UIEH-1158)
* Change Resource Settings display on View Resource details record. (UIEH-1160)
* Jest+RTL > Test AgreementsAccordion. (UIEH-1071)
* Change Package Settings display on View Package details record. (UIEH-1159)
* Add tests for PackageSearchList, ProviderSearchList, TitleSearchList components. (UIEH-1070)
* Change `loadMoreButton` to `PrevNextButtons`. (UIEH-1163)
* Add tests for PackageCreate component. (UIEH-1072)
* Jest+RTL > Test SearchFilters. (UIEH-1075)
* Jest+RTL > Test CustomLabelField. (UIEH-1076)
* Fix cannot edit a package-title (aka resource) record. (UIEH-1168)
* Fix Root proxy selection. (UIEH-1143)
* Provider Record: List of Packages Results | Apply Next/Previous Component. (UIEH-1005)
* Add tests for SettingsRootProxy component. (UIEH-1078)
* Jest+RTL > Test Tags. (UIEH-1080)
* Jest+RTL > Test PackageFilterModal. (UIEH-1081)
* Apply Next/Previous Pagination Component for Packages results. (UIEH-1162)
* Apply Next/Previous Pagination Component for Providers results. (UIEH-1165)
* Apply Next/Previous Pagination Component for Titles results. (UIEH-1164)
* Add tests for SettingsCustomLabels component. (UIEH-1077)
* Add tests for DetailsView component. (UIEH-1082)
* Jest+RTL > Test ScrollView. (UIEH-1085)
* Add tests for SearchForm conponent. (UIEH-1086)
* Add tests for SearchModal component. (UIEH-1087)
* Change all detail records headline component size to XL. (UIEH-1204)
* Fix apparition of navigation modal after saving changes while editing Custom Title. (UIEH-1203)
* Move Access status type field to Package Settings accordion in Edit Custom Package page. (UIEH-1202)
* Add tests for SettingsKnowledgeBase component. (UIEH-1089)
* Change all detail records headline component size to XL. (UIEH-1204)
* Add tests for SettingsAccessStatusTypes component. (UIEH-1088)
* Fix when changing holding status, list of titles accordion does not reflect new holdings status UNLESS one refreshes page (UIEH-1171)
* Add tests for SettingsAssignedUsers component. (UIEH-1090)
* Removing Impagination dependency. (UIEH-1175)
* Add tests for ManagedPackageEdit component. (UIEH-1091)
* Add tests for CustomEditPackage component. (UIEH-1092)
* Add tests for UsageConsolidationAccordion component. (UIEH-1178)
* Run Deque aXe on Resource Edit page. (UIEH-1205)
* Update to stripes v7 and react v17. (UIEH-1170)
* Add tests for SearchRoute component. (UIEH-1192)
* Shift focus once user hits Previous or Next pagination link. (UIEH-1206)
* Allow user to save special characters in Settings Custom labels. (UIEH-1209)
* Remove SearchPane component. (UIEH-1177)
* Combine QueryList and QuerySearchList components into one. (UIEH-1208)
* Add tests for SettingsAccessStatusTypesRoute component. (UIEH-1193)
* Jest+RTL > Test SettingsCustomLabelsRoute. (UIEH-1195)
* Add tests for SettingsAssignedUsersRoute component. (UIEH-1194)
* Jest+RTL > Test SettingsRootProxyRoute. (UIEH-1197)

## [6.1.1] (https://github.com/folio-org/ui-eholdings/tree/v6.1.1) (2021-07-15)

* Fix: saving the update of coverage settings temporarily shows the old date. (UIEH-1146)
* Add tests for InternalLink, ProxyDisplay, shouldFocus, TokenDisplay, eHoldings components. (UIEH-1054)

## [6.1.0] (https://github.com/folio-org/ui-eholdings/tree/v6.1.0) (2021-06-04)

* Add tests coverage for keyboard shortcuts to eholdings. (UIEH-1043)
* Add app context menu dropdown. (UIEH-1108)
* eholdings App: Consume {{FormattedDate}} and {{FormattedTime}} via stripes-component. (UIEH-970)
* Add tests on Jest+RTL for ProviderShow component. (UIEH-1093)
* Search shortcut should redirect to eHoldings search page. (UIEH-1111)
* Remove the Ordered through EBSCO option from filters. (UIEH-1118)
* Package record: Show a message that proxy or token value may take some time to update. (UIEH-1116)
* Usage & analysis accordion focus issues. (UIEH-1110)
* Add test on Jest+RTL for ProviderEdit component. (UIEH-1083)
* Compile translation files into AST format. (UIEH-1124)
* Settings > eHoldings | Apply baseline keyboard shortcuts. (UIEH-1121)
* Add test on Jest+RTL for ResourceShow, TagsAccordion, CustomLabelsAccordion components. (UIEH-1097)
* View Packages Record > Titles Accordion | Apply Load more results feature. (UIEH-1004)
* App menu: Add Keyboard shortcuts item and display a list of keyboard shortcuts in a modal. (UIEH-1129)
* Add ability to configure APIGEE. (UIEH-1112)
* Add tests on Jest+RTL for TitleEdit component. (UIEH-1069)
* Add Jest+RTL tests for ResourceEdit. (UIEH-1084)
* Add tests on Jest+RTL for AccessTypeEditSection, AccessTypeSelect, CustomLabelEditSection, CustomLabelShowSection and AccordionListHeader components. (UIEH-1047)

## [6.0.3] (https://github.com/folio-org/ui-eholdings/tree/v6.0.3) (2021-04-20)

* Usage & analysis accordion focus issues. (UIEH-1110)

## [6.0.2] (https://github.com/folio-org/ui-eholdings/tree/v6.0.2) (2021-04-16)

* Fix unable to change Knowledge base name. (UIEH-1122)

## [6.0.1] (https://github.com/folio-org/ui-eholdings/tree/v6.0.1) (2021-03-29)

* Fix scroll wobble when page is zoomed out. (UIEH-1107)

## [6.0.0] (https://github.com/folio-org/ui-eholdings/tree/v6.0.0) (2021-03-17)

* Settings - Usage Consolidation - Currency. (UIEH-965)
* Settings - Usage Consolidation - Start month for usage statistics. (UIEH-966)
* Settings - Usage Consolidation - Usage consolidation ID. (UIEH-968)
* Package Record: Display Usage & Analysis Accordion (UIEH-941)
* Added Usage Consolidation Filters to Package Show page. (UIEH-942, UIEH-973)
* Title+Package Record: Display Usage & Analysis Accordion. (UIEH-949)
* Added Usage Consolidation Summary table to Package Show page. (UIEH-945)
* Added Usage Consolidation Filters to Resource Show page. (UIEH-951)
* Title Record: Display Usage & Analysis Accordion. (UIEH-950)
* Settings: Usage Consolidation: Permissions. (UIEH-938)
* Added Usage Consolidation Summary table to Resource Show page. (UIEH-952)
* Title Record: Display Holdings summary table. (UIEH-999)
* Add info popover for Usage Consolidation Accordion. (UIEH-993)
* Edit Package/Resource record: Field labels text size is too small. (UIEH-1003)
* Add Full text request usage table to Resource/Title Show page. (UIEH-953, UIEH-997)
* Add Usage Consolidation Titles table to Package Show page. (UIEH-948)
* Fix Usage Consolidation currency setting not updating. (UIEH-1009)
* Clear Usage Consolidation data when leaving Package/Title/Resource View page. (UIEH-1013)
* Package Show page | Export Titles. (UIEH-946)
* Display Usage data metric selection for Total usage on Summary table. (UIEH-994)
* Remove Actions button dropdown from Title/Resource Summary Table. (UIEH-1014)
* Hide Usage Consolidation accordion when Package/Title/Resource is not selected. (UIEH-1000)
* Settings - Usage Consolidation: Display a successful toast notification. (UIEH-1010)
* Settings > eholdings > Usage Consolidation: Display a Show/Hide ID toggle. (UIEH-1022)
* Settings > eholdings > Show/Hide API key toggle. (UIEH-1023)
* Increase Settings Custom Labels display label max length to 200. (UIEH-985)
* Increase Custom Labels value max length to 500. (UIEH-985)
* Fix routing issues when visiting Note Edit page. (UIEH-991)
* Add permission for button New Settings (eHoldings): Can create, edit, and view knowledge base credentials. (UIEH-992)
* Title Record: Add a Selection Status filter to Search within Packages modal. (UIEH-978)
* Add label for contributor type narrator. (UIEH-977)
* Remove request to '/status' in Settings > eHoldings. (UIEH-1012)
* Fixed text wrapping for Custom Labels. (UIEH-985)
* Make Coverage Accordion in Resource Page be always expanded. (UIEH-1008)
* Update focus behavior on Result list pane. (UIEH-1001)
* Add assign/unassign user from KB permissions. (UIEH-1018)
* Fix "Required ARIA parent role not present: tablist" error. (UIEH-926)
* Update `stripes` to v6. (UIEH-1019)
* Add PERSONAL_DATA_DISCLOSURE.md. (UIEH-1031)
* Updates to eHoldings back-end error EBSCO connect link. (UIEH-964)
* Update `stripes-cli` to v2.
* Added Notes accordion to Title Show page. (UIEH-1033)
* Support `eholdings` interface version `3.0`.
* Support erm interface v4.0
* Fix typos in Full text requests table title. (UIEH-1039)
* Title record: Usage & analysis > Summary Table > Remove Usage and CostPerUse columns. (UIEH-1040)
* Fix message for empty cost and usage data in Resource Usage Consolidation Accordion. (UIEH-1041)
* Fix Package/Title/Provider scroll disappearing when an accordion is collapsed. (UIEH-1026)
* Add FOLIO keyboard shortcuts to eholdings. (UIEH-979)
* Fix cannot create a custom title. (UIEH-1103)
* Change displayed permission name for `module.eholdings.enabled`. (UIEH-1104)
* Fix Settings assign/usassign user permission. (UIEH-1106)
* Provider: Re-order accordions display. (UIEH-1044)
* Change displayed permission name for `settings.eholdings.enabled`. (UIEH-1105)
* Package Record | Change accordion order. (UIEH-1045)
* Display Holdings Summary Heading for Title record. (UIEH-1109)

## [5.0.0] (https://github.com/folio-org/ui-eholdings/tree/v5.0.0) (2020-10-15)

* Fix permission error in devtools console. (UIEH-915)
* Change filter by Tags request format. (UIEH-922)
* Add package selection confirmation modal. (UIEH-907)
* Add possibility to delete KB credentials. (UIEH-909)
* Refactor from `bigtest/mirage` to `miragejs`.
* Remove headlines from Root Proxy and KB settings pages. (UIEH-911)
* Increment `@folio/stripes` to `v5`, `react-router` to `v5.2`.
* Improve error messaging for unconfigured KB credentials and exceeded API limit. (UIEH-816)
* Add delete KB credentials permission, renamed existing KB credentials permission. (UIEH-910)
* Fixed no Provider/Package/Title results message. (UIEH-905)
* Change holdings status button label. (UIEH-935)
* Changed asterisk to red and added accessibility label on Create/Edit Custom Package > Name. (UIEH-919)
* Changed asterisk to red and added accessibility label on Create/Edit Custom Title > Name and Package. (UIEH-920)
* Add custom labels settings permissions. (UIEH-865)
* Add possibility to filter packages on the title page. (UIEH-928)
* New/Edit Custom title: update Name required error message. (UIEH-958)
* Add Tags label assigned to Title and Packages. (UIEH-933, UIEH-934)
* Fix Package/Title view page wobbles when scrolling. (UIEH-960)
* Add Tags label assigned to Title and Packages. (UIEH-933, UIEH-934)
* Pass aria-labelledby to MultiSelection component. (UIEH-939)
* Bumped `erm` interface version to `3.0`.
* Fixed id and aria-labelledby attributes in Pane header. (UIEH-924)
* Fix issues in Title Record Filter packages Multi-select component. (UIEH-959)
* Fixed Providers, Packages, Titles filter - accordions ARIA attributes. (UIEH-923)
* Bumped `react-intl` version to `5.8.0`.
* Fixed View Package > Find Title - Accordions missing some ARIA attributes. (UIEH-925)
* Fix bug with `<Datepicker>` in Resource Edit Page. (UIEH-961)
* Fix issue in agreements accordion with displaying start date. (UIEH-971)
* Ability to unlink an agreement from package/resource. (UIEH-956)
* Add Unassign Agreement modal window. (UIEH-972)

## [4.0.1] (https://github.com/folio-org/ui-eholdings/tree/v4.0.0) (2020-07-08)

* Fix KB credentials list shown not in alphabetical order. (UIEH-912)
* Fix incorrect x-okapi-token sent after re-logging in eHoldings. (UIEH-918)
* Fix filter by Access Types request incorrectly formatted. (UIEH-917)
* Fix routing issues. (UIEH-916)
* Added possibility to change KB Name. (UIEH-898)

## [4.0.0] (https://github.com/folio-org/ui-eholdings/tree/v4.0.0) (2020-06-11)

* Pin `moment` at `~2.24.0`. Refs STRIPES-678.
* Add filtering of titles by Access Types. (UIEH-834)
* Add validation for duplicated Access Types. (UIEH-878)
* Add permission names to translations. (UIEH-890)
* Update react-intl to v4
* Update `stripes` to `v4`
* Hide delete button when access type is used in records. (UIEH-868)
* Provider Record list of Packages UI updates. (UIEH-861)
* Package record list UI updates. (UIEH-862)
* Title Record list of Packages UI updates. (UIEH-863)
* Ability to create multiple Knowledge base configurations. (UIEH-856)
* Add a Name field to Settings Knowledge Base page. (UIEH-855)
* Apply the default container width to create, edit, view pages. (UIEH-896)
* Fix accessibility and semantics issues on the settings page. (UIEH-894, UIEH-895)
* Fix DetailsView scrolling issues. (UIEH-897)
* Access status types settings permissions. (UIEH-864)
* Settings > Access status types > Delete confirmation modal change. (UIEH-872)
* Handle error when trying to delete access status type that doesn't exist. (UIEH-860)

## [3.0.2] (https://github.com/folio-org/ui-eholdings/tree/v3.0.2) (2020-04-08)

* Retain search within packages search and filter selections on the Provider record (UIEH-847)
* Retain search within titles search and filter selections on the Package record (UIEH-853)
* Display Access Status Types on Create/Edit/View records. (UIEH-831)
* Fix Tags filter is selected by default in Search Modal. (UIEH-882)
* Fix filter by Access Types will not return records. (UIEH-883)

## [3.0.1] (https://github.com/folio-org/ui-eholdings/tree/v3.0.1) (2020-04-02)

* Provider Results UI updates (UIEH-846)
* Fix Unsaved Changes Modal not appearing after changing package selected status. (UIEH-854)
* Fix need to click 'X' twice to return after changing selected status and visiting Edit page. (UIEH-854)
* Fix Proxy selection is set to None when package has Inherited proxy. (UIEH-854)
* Fix inconsistent proxy selection for Resources. (UIEH-875)
* Fix Unsaved Changes Modal not appearing after changing Resource selected status. (UIEH-876)
* Filter Packages by Access Status Type. (UIEH-835)

## [3.0.0] (https://github.com/folio-org/ui-eholdings/tree/v3.0.0) (2020-03-13)

* Add display custom labels on view resource page (UIEH-805)
* Add display custom labels on edit resource page (UIEH-185)
* Create Settings Custom Labels Page (UIEH-184)
* Update eslint to v6.2.1 (UIEH-818)
* Fix view of Action button on package view page header (UIEH-829)
* Remove Actions dropdown from view provider record page. (UIEH-821)
* Remove Actions dropdown from view custom title record page. (UIEH-824)
* Remove Edit/Pencil icon from view package record page (UIEH-822)
* Create Settings Access status types page (UIEH-828)
* Migrate to `stripes` `v3.0.0` and move `react-intl` and `react-router` to peerDependencies.
* Show a Delete warning and confirmation for Access status types (UIEH-842)
* Packages: Clicking "X" starts a nasty loop (UIEH-845)
* Package Results UI updates (UIEH-844)

## [2.1.0](https://github.com/folio-org/ui-eholdings/tree/v2.1.0) (2019-12-04)

* Fixed tests for the notes & for the agreements (STSMACOM-270)
* Fix pane header ids for details view and search paneset. Provide aria label for tags multiselect. (UIEH-780)
* Added tags.all permission to package.json (UIEH-807)
* Add condition to do agreements GET only when it is allowed (UIEH-800)
* Lock react-final-form 6.3.0 version (UIEH-803)
* Fixed error handling for agriments related api calls (UIEH-797)
* Retrieve up to 100k of requested tags instead of 10 (UIEH-796)
* Set focus on search box when accessing the eholdings (UIEH-790)
* Substitute custom eholdings panels for Titles new and Packages new routes with the one from stripes (UIEH-795)
* Refactor settings to use Panes from stripes-components (UIEH-794)
* Support erm interface v2.0

## [2.0.2](https://github.com/folio-org/ui-eholdings/tree/v2.0.2) (2019-09-25)

* Fix BigTest imports (UIEH-793)
* Add isFullPackage flag (UIEH-787)

## [2.0.1](https://github.com/folio-org/ui-eholdings/tree/v2.0.1) (2019-09-16)

* Regenerate yarn.lock for pointing all packages to npm-folio registry
* Fix tests for Notes

## [2.0.0](https://github.com/folio-org/ui-eholdings/tree/v2.0.0) (2019-09-11)

* Update tags endpoints(UIEH-745, UIEH-747, UIEH-748)
* Fix audiobook misspelling causing inability to create a title(UIEH-763)
* Update translation strings
* Updated react-final-form and related dependencies(UIEH-770)
* Remove tags from resource/package/provider PUT payload(UIEH-769)
* Fix accessibility issues(UIEH-750)
* Put repeatable fields on a single line(UIEH-773)
* Fix height of the pane container to fit all content(UIEH-760)
* Updated serializes to exclude not used attrs from PUT package and provider payloads(UIEH-777, UIEH-778)
* Fix mirage handler for GET titles with tags filter(UIEH-758)
* Add error handling for agreements endpoints(UIEH-766)
* Fixed add to custom package modal(UIEH-761, UIEH-762)
* Disallow to create more than 1 date coverage range on Package create page(UIEH-782)

## [1.9.0](https://github.com/folio-org/ui-eholdings/tree/v1.9.0) (2019-08-02)

* Restore eHoldings to the settings menu (UIEH-757, UITEN-35)

## [1.8.0](https://github.com/folio-org/ui-eholdings/tree/v1.8.0) (2019-07-24)

* Make search filters collapsed by default(UIEH-737)
* Update URLs leading to Agreements app(ERM-253)
* Add filter by tags support(UIEH-710, UIEH-711, UIEH-634)
* Remove convertion to lower case of contributor type(UIEH-687)
* Indicate descending order for custom coverage date ranges(UIEH-734)
* Pass AppIcon instance to Pane props(UIEH-728)
* Add numeric formatting for "Titles Selected" and "Total Number of Titles" in package-show page(UIEH-735)
* Use granular permissions for settings items (UITEN-35)

## [1.7.0](https://github.com/folio-org/ui-eholdings/tree/v1.7.0) (2019-06-11)

* Fixed tests related to the datepicker (UIEH-725)
* Fix toggling of the notes accordions (UIEH-718)
* Add Notes accordion to Provider and Resource view pages (UIEH-690)
* Provider/Package/Resource: View a note page (UIEH-698)
* Provider/Package/Resource: Create a note page (UIEH-693)
* Title: Remove Tags functionality (UIEH-685)
* Notes accordion for package show page (UIEH-691)
* Create note page (UIEH-693)

## [1.6.0](https://github.com/folio-org/ui-eholdings/tree/v1.6.0) (2019-05-10)

* Add New button to agreements accordion on Package and Resource show pages for redirecting the user to creation page. (UIEH-629, UIEH-631)
* Add badge with agreements quantity to agreements section on Package and Resource show pages (UIEH-680)
* Fixed translation for capitalized strings (UIEH-651)
* Fix agreements attach functionality (UIEH-684)

## [1.5.0](https://github.com/folio-org/ui-eholdings/tree/v1.5.0) (2019-03-25)

* Apply permissions. Define UI permissions (UIEH-501)
* Assign tags to show provider record (UIEH-585)
* Assign tags to package record (UIEH-586)
* Assign tags to title+package (aka resource) records (UIEH-587)
* Paneheader Dropdown Update: Add and update Full View option (UIEH-603)
* App screen issue (UIEH-610)
* Resolve CoverageDateList warning (UIEH-614)
* BUG: Title Edit Error - Unrecognized contentType field (UIEH-621)
* Title Edit Error : fields temporarily revert to previous value after save (UIEH-627)
* Show Package Record: Allow a user to search agreements and attach to a package (UIEH-628)
* Show Title+Package Record: Allow a user to search agreements and attach to a title+package (UIEH-630)
* Update titles data using new BE endpoint (UIEH-636)
* Bug on closing unsaved form (UIEH-637)
* Tags: assign/unassign tags on provider when no package is selected (UIEH-641)
* Tags: assign/unassign tags on resources regardless of isSelected value (UIEH-642)
* eHoldings App - English words/ phrases showing up while in RTL (UIEH-650)
* Attribute Type is missing error on title edit (UIEH-656)
* Package Detail Record: Search within titles does not work (UIEH-663)
* Package/Resource: Removing Coverage Date will not allow you to save (UIEH-665)
* Change custom coverage tests in accordance with the new back-end response (UIEH-666)
* Fix bug on Resource page when it was unable to reset to Managed Coverage Date (UIEH-667)
* Custom Embargo: Removing Custom Embargo will not enable Save button (UIEH-668)
* Make eholdings UI permissions effective (UIEH-669)
* Tags: assign/unassign tags on packages regardless of isSelected value (UIEH-670)

/**
 * DEPRECATED — DO NOT INSTALL OR COPY THIS FILE INTO THE BOUND PROJECT.
 *
 * As of tracker v6, the simple onEdit entrypoint, field normalization, lifecycle
 * routing, Activity Log writes, setup cleanup, and integrity audit all live in:
 *
 *   GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs
 *
 * Keeping two script files with competing onEdit/trigger setup was unsafe because
 * one human edit could be processed twice. This tombstone intentionally defines no
 * functions. Existing bound projects should replace their old tracker code with the
 * current canonical file and run installPartitionedTrackerAutomation() once; that
 * function now REMOVES legacy installable trackerOnEdit triggers and does not create
 * a new one.
 */

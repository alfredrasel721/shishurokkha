plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "org.shishurokkha.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "org.shishurokkha.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }

    flavorDimensions += "role"
    productFlavors {
        create("parent") {
            dimension = "role"
            applicationIdSuffix = ".parent"
            resValue("string", "app_name", "ShishuRokkha Parent")
            buildConfigField("String", "APP_ROLE", "\"parent\"")
        }
        create("child") {
            dimension = "role"
            applicationIdSuffix = ".child"
            resValue("string", "app_name", "ShishuRokkha Child")
            buildConfigField("String", "APP_ROLE", "\"child\"")
        }
    }
    buildFeatures { buildConfig = true }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}
